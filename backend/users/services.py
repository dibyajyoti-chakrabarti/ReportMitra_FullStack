import math
from datetime import timedelta

from django.apps import apps
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

def _trust_score_log_model():
    return apps.get_model("users", "TrustScoreLog")

def _issue_report_model():
    return apps.get_model("report", "IssueReport")


def calculate_deactivation_days(days_since_last_violation, b_min=1, b_max=30, d=30):
    """
    Smoothed inverse penalty window:
    ban_days = b_min + (b_max - b_min) * e^(-(days_since_last_violation / d))
    """
    if days_since_last_violation is None:
        days_since_last_violation = 0

    days_since_last_violation = max(0, days_since_last_violation)

    raw_days = b_min + (b_max - b_min) * math.exp(-(days_since_last_violation / d))
    ban_days = int(math.floor(raw_days))
    return max(b_min, min(b_max, ban_days))


def format_activation_time(dt):
    if not dt:
        return None
    local_dt = timezone.localtime(dt)
    return local_dt.strftime("%H:%M, %d %B %Y")


def raise_if_user_deactivated(user):
    if not user.deactivated_until:
        return
    if user.deactivated_until <= timezone.now():
        return

    raise serializers.ValidationError(
        {
            "code": "ACCOUNT_DEACTIVATED",
            "message": "Account is temporarily deactivated.",
            "deactivated_until": user.deactivated_until,
            "activation_time": format_activation_time(user.deactivated_until),
        }
    )


@transaction.atomic
def apply_trust_score_change(
    *,
    user,
    delta,
    reason,
    report=None,
    appeal_status="not_appealed",
    admin_id=None,
):
    """
    Single path for trust score updates with immutable audit logs.
    Negative deltas are blocked while user is deactivated.
    """
    if delta < 0 and user.is_temporarily_deactivated:
        return user.trust_score

    next_score = max(0, min(110, user.trust_score + delta))
    applied_delta = next_score - user.trust_score

    if applied_delta == 0:
        return user.trust_score

    user.trust_score = next_score
    user.save(update_fields=["trust_score"])

    trust_score_log = _trust_score_log_model()
    trust_score_log.objects.create(
        user=user,
        delta=applied_delta,
        reason=reason,
        report=report,
        appeal_status=appeal_status,
        admin_id=admin_id,
    )

    return user.trust_score


def deactivate_user_until(user, *, days):
    until = timezone.now() + timedelta(days=days)
    user.deactivated_until = until
    user.save(update_fields=["deactivated_until"])
    return until


@transaction.atomic
def evaluate_resolution_incentive(user):
    """
    One-time reward:
    trust_score == 110 and latest 6 reports are all resolved.
    """
    issue_report = _issue_report_model()
    locked_user = user.__class__.objects.select_for_update().get(pk=user.pk)

    latest_statuses = list(
        issue_report.objects.filter(user=locked_user)
        .order_by("-issue_date")
        .values_list("status", flat=True)[:6]
    )
    has_six_reports = len(latest_statuses) == 6
    all_latest_six_resolved = has_six_reports and all(
        status == "resolved" for status in latest_statuses
    )
    is_eligible_now = (
        locked_user.trust_score == 110
        and all_latest_six_resolved
        and not locked_user.incentive_reward_granted
    )

    reward_just_granted = False
    if is_eligible_now:
        locked_user.incentive_reward_granted = True
        locked_user.incentive_reward_amount += 50
        locked_user.save(
            update_fields=[
                "incentive_reward_granted",
                "incentive_reward_amount",
            ]
        )
        reward_just_granted = True

    return {
        "incentive_reward_granted": locked_user.incentive_reward_granted,
        "incentive_reward_amount": locked_user.incentive_reward_amount,
        "incentive_reward_value": 50,
        "incentive_target_resolved_reports": 6,
        "incentive_latest_reports_checked": len(latest_statuses),
        "incentive_latest_resolved_count": sum(
            1 for status in latest_statuses if status == "resolved"
        ),
        "incentive_all_latest_reports_resolved": all_latest_six_resolved,
        "incentive_trust_score_required": 110,
        "incentive_has_required_trust_score": locked_user.trust_score == 110,
        "incentive_is_eligible_now": is_eligible_now,
        "incentive_reward_just_granted": reward_just_granted,
    }
