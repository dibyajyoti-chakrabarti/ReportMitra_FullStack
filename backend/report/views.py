# report/views.py
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import IssueReport
from .serializers import IssueReportSerializer
from user_profile.models import UserProfile

from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import boto3
import uuid

from rest_framework.permissions import AllowAny
from urllib.parse import urlparse, unquote


class IssueReportListCreateView(generics.ListCreateAPIView):
    queryset = IssueReport.objects.all().order_by("-updated_at")
    serializer_class = IssueReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # Get / create profile
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # Block if Aadhaar not verified
        if not profile.is_aadhaar_verified or not profile.aadhaar:
            raise PermissionDenied(
                "Aadhaar verification is required before creating a report."
            )

        # Just save report for this user; Aadhaar details stay in Aadhaar table
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

    # Use your existing AWS settings / env vars
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

        # Example key: reports/<user_id>/<uuid>-originalName.jpg
        key = f"reports/{request.user.id}/{uuid.uuid4().hex}-{file_name}"

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
        # Log server-side, but send generic message to client
        print("S3 presign error:", e)
        return Response(
            {"detail": "Could not create upload URL"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(["GET"])
@permission_classes([AllowAny])  # tracking is public
def presign_get_for_track(request, id):
    """
    Given a report ID, return a presigned GET URL for its S3 image.
    Used by the Track -> IssueDetails page.
    """
    from .models import IssueReport  # local import to avoid circulars

    try:
        report = IssueReport.objects.get(pk=id)
    except IssueReport.DoesNotExist:
        return Response(
            {"detail": "Report not found"}, status=status.HTTP_404_NOT_FOUND
        )

    if not report.image_url:
        return Response(
            {"detail": "No image for this report"}, status=status.HTTP_404_NOT_FOUND
        )

    # Bucket + region from settings / env
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

    # Derive the object key from the stored image_url
    parsed = urlparse(report.image_url)
    key = unquote(parsed.path.lstrip("/"))  # strip leading '/' and decode %2F etc.

    # If path is like 'bucket-name/reports/..', strip the leading 'bucket-name/'
    if key.startswith(bucket_name + "/"):
        key = key[len(bucket_name) + 1 :]

    try:
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=getattr(settings, "AWS_ACCESS_KEY_ID", None),
            aws_secret_access_key=getattr(settings, "AWS_SECRET_ACCESS_KEY", None),
            region_name=region_name,
        )

        presigned_get_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": key},
            ExpiresIn=3600,  # 1 hour
        )

        return Response({"url": presigned_get_url})
    except Exception as e:
        print("S3 presign-get error:", e)
        return Response(
            {"detail": "Could not create image view URL"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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