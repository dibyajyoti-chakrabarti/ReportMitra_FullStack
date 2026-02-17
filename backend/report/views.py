from rest_framework import generics, permissions, status, views
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.pagination import CursorPagination
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from zoneinfo import ZoneInfo
from .serializers import IssueHistorySerializer, CommentSerializer
from user_profile.models import UserProfile
from .models import IssueReport, Comment
from .serializers import IssueReportSerializer
from django.conf import settings
import boto3
import uuid


def get_daily_report_limit_status(user):
    ist = ZoneInfo("Asia/Kolkata")
    now_ist = timezone.now().astimezone(ist)
    start_of_day_ist = now_ist.replace(hour=0, minute=0, second=0, microsecond=0)
    next_midnight_ist = start_of_day_ist + timedelta(days=1)

    start_of_day_utc = start_of_day_ist.astimezone(ZoneInfo("UTC"))
    next_midnight_utc = next_midnight_ist.astimezone(ZoneInfo("UTC"))

    submission_count = IssueReport.objects.filter(
        user=user,
        issue_date__gte=start_of_day_utc,
        issue_date__lt=next_midnight_utc,
    ).count()

    daily_limit = 4
    return {
        "count": submission_count,
        "limit": daily_limit,
        "can_submit": submission_count < daily_limit,
        "retry_at_label": "12:00 AM IST",
        "retry_at_ist": next_midnight_ist.isoformat(),
    }


class ReportEligibilityView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_payload = get_daily_report_limit_status(request.user)
        return Response(status_payload)


class IssueReportListCreateView(generics.ListCreateAPIView):
    queryset = IssueReport.objects.all().order_by("-updated_at")
    serializer_class = IssueReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        """Pass request to serializer for user context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_temporarily_deactivated:
            raise PermissionDenied(
                "Account is temporarily deactivated. Please wait until reactivation."
            )

        profile, _ = UserProfile.objects.get_or_create(user=user)

        if not profile.is_aadhaar_verified or not profile.aadhaar:
            raise PermissionDenied(
                "Aadhaar verification is required before creating a report."
            )

        limit_status = get_daily_report_limit_status(user)
        if not limit_status["can_submit"]:
            raise ValidationError(
                {
                    "code": "DAILY_REPORT_LIMIT",
                    "detail": "You cannot post more than 4 reports in a day.",
                    "retry_at_label": limit_status["retry_at_label"],
                    "retry_at_ist": limit_status["retry_at_ist"],
                }
            )

        serializer.save(user=user)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def presign_s3(request):
    """
    Return a pre-signed S3 URL for direct image upload.
    Frontend expects: { url, key }
    """
    file_name = request.data.get("fileName")
    content_type = request.data.get("contentType")

    if not file_name or not content_type:
        return Response(
            {"detail": "fileName and contentType are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    bucket_name = getattr(
        settings,
        "REPORT_IMAGES_BUCKET",
        getattr(settings, "AWS_STORAGE_BUCKET_NAME", None),
    )
    if not bucket_name:
        return Response(
            {"detail": "S3 bucket name not configured on server"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    region_name = getattr(settings, "AWS_REGION", "ap-south-1")

    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=getattr(settings, "AWS_ACCESS_KEY_ID", None),
            aws_secret_access_key=getattr(settings, "AWS_SECRET_ACCESS_KEY", None),
            region_name=region_name,
        )

        key = f"reports/{uuid.uuid4().hex}-{file_name}"

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=3600,  # 1 hour
        )

        return Response({"url": presigned_url, "key": key})
    except Exception as e:
        print("S3 presign error:", e)
        return Response(
            {"detail": "Could not create upload URL"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([AllowAny])
def presign_get_for_track(request, id):
    """
    Generate presigned URLs for viewing report images
    """
    try:
        report = IssueReport.objects.get(pk=id)
    except IssueReport.DoesNotExist:
        return Response({"detail": "Report not found"}, status=404)

    bucket_name = getattr(settings, "REPORT_IMAGES_BUCKET", None)

    if not bucket_name:
        return Response(
            {"detail": "REPORT_IMAGES_BUCKET is not configured on the server"},
            status=500,
        )

    region_name = getattr(settings, "AWS_REGION", "ap-south-1")

    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=region_name,
        )
    except Exception as e:
        print(f"Error creating S3 client: {e}")
        return Response(
            {"detail": "Could not connect to S3"},
            status=500,
        )

    before_url = None
    after_url = None

    if report.image_url:
        try:
            before_url = s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": report.image_url,
                },
                ExpiresIn=3600,
            )
        except Exception as e:
            print(f"Error generating before_url for report {id}: {e}")
            before_url = None

    if report.completion_url:
        try:
            after_url = s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": report.completion_url,
                },
                ExpiresIn=3600,
            )
        except Exception as e:
            print(f"Error generating after_url for report {id}: {e}")
            after_url = None

    return Response({
        "url": before_url,
        "before": before_url,
        "after": after_url,
    })


class PublicIssueReportDetailView(generics.RetrieveAPIView):
    """
    Public endpoint to fetch a single report by tracking_id.
    No authentication required.
    """
    queryset = IssueReport.objects.all()
    serializer_class = IssueReportSerializer
    permission_classes = [AllowAny]
    lookup_field = "tracking_id"
    lookup_url_kwarg = "tracking_id"

    def get_serializer_context(self):
        """Pass request to serializer for user context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CommunityCursorPagination(CursorPagination):
    page_size = 6
    ordering = "-updated_at"


class CommunityResolvedIssuesView(ListAPIView):
    """
    List all resolved issues for community feed
    Supports pagination and includes social features
    """
    permission_classes = [AllowAny]
    serializer_class = IssueReportSerializer
    pagination_class = CommunityCursorPagination

    def get_queryset(self):
        return IssueReport.objects.filter(
            status="resolved"
        ).order_by("-updated_at")
    
    def get_serializer_context(self):
        """Pass request to serializer for user context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class UserIssueHistoryView(generics.ListAPIView):
    """
    View user's own issue report history
    """
    serializer_class = IssueHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IssueReport.objects.filter(
            user=self.request.user
        ).order_by("-issue_date")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_appeal(request, report_id):
    report = get_object_or_404(IssueReport, id=report_id, user=request.user)

    if report.status != "rejected":
        return Response(
            {"detail": "Appeal is allowed only for rejected reports."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if report.appeal_status != "not_appealed":
        return Response(
            {"detail": "Appeal has already been submitted for this report."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    report.appeal_status = "pending"
    report.save(update_fields=["appeal_status"])

    return Response(
        {
            "message": "Appeal submitted successfully.",
            "appeal_status": report.appeal_status,
        },
        status=status.HTTP_200_OK,
    )


class CommentListCreateView(generics.ListCreateAPIView):
    """
    List and create comments for a specific report
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        report_id = self.kwargs.get('report_id')
        return Comment.objects.filter(report_id=report_id)

    def get_serializer_context(self):
        """Pass request to serializer for user context"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        report_id = self.kwargs.get('report_id')
        report = get_object_or_404(IssueReport, id=report_id)
        serializer.save(user=self.request.user, report=report)


class ToggleLikeView(views.APIView):
    """
    Toggle like on a report
    Returns updated like/dislike counts
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, report_id):
        report = get_object_or_404(IssueReport, id=report_id)
        user = request.user
        
        if report.likes.filter(id=user.id).exists():
            report.likes.remove(user)
            liked = False
        else:
            report.likes.add(user)
            # Remove dislike if exists
            if report.dislikes.filter(id=user.id).exists():
                report.dislikes.remove(user)
            liked = True
            
        return Response({
            "liked": liked, 
            "likes_count": report.likes.count(),
            "dislikes_count": report.dislikes.count()
        })


class ToggleDislikeView(views.APIView):
    """
    Toggle dislike on a report
    Returns updated like/dislike counts
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, report_id):
        report = get_object_or_404(IssueReport, id=report_id)
        user = request.user
        
        if report.dislikes.filter(id=user.id).exists():
            report.dislikes.remove(user)
            disliked = False
        else:
            report.dislikes.add(user)
            # Remove like if exists
            if report.likes.filter(id=user.id).exists():
                report.likes.remove(user)
            disliked = True
            
        return Response({
            "disliked": disliked, 
            "likes_count": report.likes.count(),
            "dislikes_count": report.dislikes.count()
        })
