from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import IssueReport
from .serializers import IssueReportSerializer
from user_profile.models import UserProfile
from rest_framework.permissions import AllowAny  # Add this

#AWS
import os
import json
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from botocore.exceptions import ClientError
import boto3
from botocore.config import Config

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

class IssueReportListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IssueReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if user has a profile
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError(
                {'detail': 'Please complete your profile before submitting reports.'}
            )

        serializer.save(
            user=self.request.user, 
            reporter_first_name=user_profile.first_name,
            reporter_middle_name=user_profile.middle_name,
            reporter_last_name=user_profile.last_name
        )

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            # Add tracking ID to response
            if response.status_code == status.HTTP_201_CREATED:
                report = IssueReport.objects.get(id=response.data['id'])
                response.data['tracking_id'] = report.tracking_id
            return response
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)


class PublicIssueReportDetailView(generics.RetrieveAPIView):
    """Public view for tracking reports without authentication"""
    serializer_class = IssueReportSerializer
    permission_classes = [AllowAny]
    lookup_field = 'tracking_id'
    queryset = IssueReport.objects.all()

    def get_object(self):
        tracking_id = self.kwargs.get('tracking_id')
        try:
            return IssueReport.objects.get(tracking_id=tracking_id.upper())  # Ensure uppercase
        except IssueReport.DoesNotExist:
            raise serializers.ValidationError(
                {'detail': 'Report not found. Please check the tracking ID.'}
            )
        

@csrf_exempt
def presign_s3(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")
    try:
        payload = json.loads(request.body.decode("utf-8"))
        file_name = payload.get("fileName")
        content_type = payload.get("contentType", "application/octet-stream")
        if not file_name:
            return HttpResponseBadRequest(json.dumps({"error":"fileName required"}), content_type="application/json")

        BUCKET = os.getenv("S3_BUCKET")
        REGION = os.getenv("AWS_REGION", "ap-south-1")

        # Force regional endpoint and virtual-hosted addressing to avoid 307 redirects
        config = Config(
            region_name=REGION,
            s3={"addressing_style": "virtual"},
            signature_version="s3v4"
        )
        endpoint_url = f"https://s3.{REGION}.amazonaws.com"
        s3 = boto3.client("s3", region_name=REGION, config=config, endpoint_url=endpoint_url)

        key = f"reports/{uuid.uuid4().hex}_{file_name}"

        params = {
            "Bucket": BUCKET,
            "Key": key,
            "ContentType": content_type,
            # 'ACL': 'public-read'  # optional - don't enable for prod unless intended
        }

        # Increase ExpiresIn for dev testing; set lower in prod (e.g. 300)
        url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params=params,
            ExpiresIn=900  # 15 minutes for testing
        )
        return JsonResponse({"url": url, "key": key})
    except ClientError as e:
        return JsonResponse({"error": str(e)}, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([AllowAny])
def presign_get_for_track(request, id):
    from urllib.parse import urlparse, unquote
    import boto3
    from botocore.config import Config
    import os

    try:
        report = IssueReport.objects.get(id=id)
    except IssueReport.DoesNotExist:
        return Response({"detail": "Not found"}, status=404)

    # try to use image_key first
    key = getattr(report, "image_key", None)

    if not key and report.image_url:
        parsed = urlparse(report.image_url)
        key = unquote(parsed.path.lstrip("/"))
        bucket = os.getenv("S3_BUCKET")
        if bucket and key.startswith(bucket + "/"):
            key = key[len(bucket) + 1:]

    if not key:
        return Response({"detail": "No image provided"}, status=404)

    bucket = os.getenv("S3_BUCKET")
    region = os.getenv("AWS_REGION", "ap-south-1")

    config = Config(signature_version="s3v4", region_name=region)
    s3 = boto3.client("s3", config=config)

    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=3600
    )

    return Response({"url": url})
