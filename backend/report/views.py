# report/views.py
from rest_framework import generics, permissions, status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import CursorPagination
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import IssueHistorySerializer
from user_profile.models import UserProfile
from .models import IssueReport
from .serializers import IssueReportSerializer
from urllib.parse import urlparse, unquote
from django.conf import settings
import boto3
import uuid


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
@permission_classes([AllowAny])
def presign_get_for_track(request, id):
    from .models import IssueReport

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

    # ---------------- BEFORE IMAGE ----------------
    if report.image_url:
        try:
            # image_url is a full S3 URL like:
            # https://reportmitra-report-images-dc.s3.ap-south-1.amazonaws.com/reports%2F6%2F5cdfb3535e6949af91ec82e9241f7a03-phole.jpg
            
            parsed = urlparse(report.image_url)
            # Extract path and decode URL encoding: /reports%2F6%2F... -> /reports/6/...
            key = unquote(parsed.path.lstrip("/"))
            
            # Remove bucket name if it's in the path (shouldn't be for your URLs, but just in case)
            if key.startswith(bucket_name + "/"):
                key = key[len(bucket_name) + 1:]

            before_url = s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": key,
                },
                ExpiresIn=3600,
            )
        except Exception as e:
            print(f"Error generating before_url for report {id}: {e}")
            print(f"image_url was: {report.image_url}")
            before_url = None

    # ---------------- AFTER IMAGE ----------------
    if report.completion_url:
        try:
            # completion_url is just the S3 key like:
            # completion/Sanitation Department/565b2eba-0af0-4d1b-a946-090d0e000eb8.jpeg
            
            # No need to parse or decode - it's already the key
            key = report.completion_url

            after_url = s3_client.generate_presigned_url(
                "get_object",
                Params={
                    "Bucket": bucket_name,
                    "Key": key,
                },
                ExpiresIn=3600,
            )
        except Exception as e:
            print(f"Error generating after_url for report {id}: {e}")
            print(f"completion_url was: {report.completion_url}")
            after_url = None

    # ---------------- RESPONSE (BACKWARD COMPATIBLE) ----------------
    return Response({
        # OLD CONTRACT (IssueDetails.jsx)
        "url": before_url,

        # NEW CONTRACT (Community PostCard.jsx)
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

class CommunityCursorPagination(CursorPagination):
    page_size = 6
    ordering = "-updated_at"   # latest first


class CommunityResolvedIssuesView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = IssueReportSerializer
    pagination_class = CommunityCursorPagination

    def get_queryset(self):
        return IssueReport.objects.filter(
            status="resolved"
        ).order_by("-updated_at")
    
class UserIssueHistoryView(generics.ListAPIView):
    serializer_class = IssueHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IssueReport.objects.filter(
            user=self.request.user
        ).order_by("-issue_date")
