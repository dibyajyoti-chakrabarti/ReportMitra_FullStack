# report/serializers.py
import os
from django.conf import settings
from rest_framework import serializers
from .models import IssueReport

class IssueReportSerializer(serializers.ModelSerializer):
    reporter_first_name = serializers.CharField(required=False, allow_blank=True)
    reporter_middle_name = serializers.CharField(required=False, allow_blank=True)
    reporter_last_name = serializers.CharField(required=False, allow_blank=True)
    class Meta:
        model = IssueReport
        fields = '__all__'
        read_only_fields = ('id', 'issue_date', 'updated_at', 'status', 'user')  # adjust if yours differ

    def build_s3_url(self, key: str) -> str:
        """Build the full s3 HTTPS url for a given key if key looks like one."""
        if not key:
            return key
        # If already a full URL, return as-is
        if key.startswith("http://") or key.startswith("https://"):
            return key

        bucket = os.getenv("S3_BUCKET") or getattr(settings, "S3_BUCKET", None)
        region = os.getenv("AWS_REGION") or getattr(settings, "AWS_REGION", None)
        # Fallback if region missing (still should work for most buckets)
        if not bucket:
            return key  # leave as-is if we can't build
        if region:
            return f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
        return f"https://{bucket}.s3.amazonaws.com/{key}"

    def create(self, validated_data):
        """
        Normalize image_url (key -> full URL), attach request.user as user,
        and auto-fill reporter_first_name / reporter_last_name from user's profile
        if the client didn't provide them.
        """
        # --- Normalise image_url / image_key if present ---
        image_val = validated_data.get("image_url")
        if image_val and not image_val.startswith("http"):
            key = image_val
            # only set image_key if model has that field (you may have added it)
            if "image_key" in self.Meta.model._meta.fields_map or hasattr(self.Meta.model, "image_key"):
                validated_data["image_key"] = key
            validated_data["image_url"] = self.build_s3_url(key)
        elif image_val and image_val.startswith("http"):
            # leave image_url as-is; optional: try to infer key if you want
            pass

        # --- Attach user from request if not provided ---
        request = self.context.get("request")
        user = None
        if request and hasattr(request, "user") and request.user and request.user.is_authenticated:
            user = request.user
            if not validated_data.get("user"):
                validated_data["user"] = user

        # --- Auto-fill reporter name fields from user profile if missing ---
        try:
            profile = getattr(user, "user_profile", None)
            if profile:
                if not validated_data.get("reporter_first_name"):
                    validated_data["reporter_first_name"] = profile.first_name or profile.get_full_name().split()[0]
                if not validated_data.get("reporter_last_name"):
                    validated_data["reporter_last_name"] = profile.last_name or profile.get_full_name().split()[-1]
                # optionally fill middle name too
                if not validated_data.get("reporter_middle_name"):
                    validated_data["reporter_middle_name"] = profile.middle_name or ""
        except Exception:
            # fail-safe: do nothing; validation will catch missing required fields if profile absent
            pass

        return super().create(validated_data)


