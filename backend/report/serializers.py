import os
from django.conf import settings
from rest_framework import serializers
from .models import IssueReport
from urllib.parse import urlparse, unquote


class IssueReportSerializer(serializers.ModelSerializer):
    reporter_first_name = serializers.CharField(required=False, allow_blank=True)
    reporter_middle_name = serializers.CharField(required=False, allow_blank=True)
    reporter_last_name = serializers.CharField(required=False, allow_blank=True)
    class Meta:
        model = IssueReport
        fields = '__all__'
        read_only_fields = ('id', 'issue_date', 'updated_at', 'status', 'user','tracking_id')

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
        Normalize image_url (key -> full URL) or extract image_key from a full URL,
        decode percent-encoding, attach request.user, and auto-fill reporter names.
        """
        image_val = validated_data.get("image_url")
        bucket = os.getenv("S3_BUCKET") or getattr(settings, "S3_BUCKET", None)
        region = os.getenv("AWS_REGION") or getattr(settings, "AWS_REGION", "ap-south-1")

        # 1) If frontend sent only a key like "reports/xxx.jpg"
        if image_val and not image_val.startswith("http"):
            key = image_val
            validated_data["image_key"] = key if ("image_key" in [f.name for f in self.Meta.model._meta.fields]) else None
            validated_data["image_url"] = f"https://{bucket}.s3.{region}.amazonaws.com/{key}" if bucket else image_val

        # 2) If frontend sent a full URL (possibly percent-encoded)
        elif image_val and image_val.startswith("http"):
            try:
                parsed = urlparse(image_val)
                raw_path = parsed.path.lstrip('/')
                key = unquote(raw_path)           # decode %2F -> '/'
                # If path starts with bucket/, strip it
                if bucket and key.startswith(bucket + "/"):
                    key = key[len(bucket)+1:]
                # set image_key if the model has that field
                if "image_key" in [f.name for f in self.Meta.model._meta.fields]:
                    validated_data["image_key"] = key
                # canonicalize image_url to unencoded public url
                if bucket:
                    validated_data["image_url"] = f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
                else:
                    validated_data["image_url"] = unquote(image_val)
            except Exception:
                # leave as-is on failure
                validated_data["image_url"] = image_val

        # Attach user from request if not provided
        request = self.context.get("request")
        user = None
        if request and hasattr(request, "user") and request.user and request.user.is_authenticated:
            user = request.user
            if not validated_data.get("user"):
                validated_data["user"] = user

        # Auto-fill reporter name fields if missing
        try:
            profile = getattr(user, "user_profile", None)
            if profile:
                if not validated_data.get("reporter_first_name"):
                    validated_data["reporter_first_name"] = profile.first_name or ""
                if not validated_data.get("reporter_last_name"):
                    validated_data["reporter_last_name"] = profile.last_name or ""
                if not validated_data.get("reporter_middle_name"):
                    validated_data["reporter_middle_name"] = profile.middle_name or ""
        except Exception:
            pass

        return super().create(validated_data)


