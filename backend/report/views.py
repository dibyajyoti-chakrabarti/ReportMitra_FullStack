from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import IssueReport
from .serializers import IssueReportSerializer
from user_profile.models import UserProfile

#AWS
import os
import json
import uuid
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from botocore.exceptions import ClientError
import boto3
from botocore.config import Config

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
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

# class IssueReportDetailView(generics.RetrieveAPIView):
#     serializer_class = IssueReportSerializer
#     permission_classes = [IsAuthenticated]
#     lookup_field = 'id'

#     def get_queryset(self):
#         return IssueReport.objects.filter(user=self.request.user)

from rest_framework import generics
from rest_framework.permissions import AllowAny  # Add this
from .models import IssueReport
from .serializers import IssueReportSerializer

class PublicIssueReportDetailView(generics.RetrieveAPIView):
    """Public view for tracking reports without authentication"""
    serializer_class = IssueReportSerializer
    permission_classes = [AllowAny]  # Allow anyone to access
    lookup_field = 'id'
    queryset = IssueReport.objects.all()  # No user filtering for public access

    def get_serializer_class(self):
        # You might want a different serializer for public views
        # that excludes sensitive information
        return IssueReportSerializer
    
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
