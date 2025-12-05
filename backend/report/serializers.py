# report/serializers.py
import os
from urllib.parse import urlparse, unquote

from django.conf import settings
from django.utils.crypto import get_random_string
from rest_framework import serializers

from .models import IssueReport


class IssueReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReport
        fields = "__all__"
        read_only_fields = (
            "id",
            "issue_date",
            "updated_at",
            "status",
            "user",
            "tracking_id",
        )

    def _generate_unique_tracking_id(self):
        """Generate an 8-character tracking ID like 'A9F2K7Q1'."""
        allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        while True:
            tid = get_random_string(8, allowed_chars)
            if not IssueReport.objects.filter(tracking_id=tid).exists():
                return tid

    def create(self, validated_data):
        """
        Normalise image_url (key -> full URL) or keep full URL,
        and attach request.user + tracking_id.
        """
        image_val = validated_data.get("image_url")
        bucket = os.getenv("S3_BUCKET") or getattr(settings, "S3_BUCKET", None)
        region = os.getenv("AWS_REGION") or getattr(
            settings, "AWS_REGION", "ap-south-1"
        )

        # 1) If frontend sent only a key like "reports/...jpg"
        if image_val and not image_val.startswith("http"):
            key = image_val
            if bucket:
                validated_data["image_url"] = (
                    f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
                )

        # 2) If frontend sent a full URL (possibly percent-encoded)
        elif image_val and image_val.startswith("http"):
            try:
                parsed = urlparse(image_val)
                raw_path = parsed.path.lstrip("/")
                key = unquote(raw_path)
                if bucket and key.startswith(bucket + "/"):
                    key = key[len(bucket) + 1 :]
                if bucket:
                    validated_data["image_url"] = (
                        f"https://{bucket}.s3.{region}.amazonaws.com/{key}"
                    )
                else:
                    validated_data["image_url"] = unquote(image_val)
            except Exception:
                pass  # leave image_url as-is on failure

        # Attach user from request if not provided
        request = self.context.get("request")
        if (
            request
            and hasattr(request, "user")
            and request.user
            and request.user.is_authenticated
        ):
            if not validated_data.get("user"):
                validated_data["user"] = request.user

        # Generate tracking_id once
        if not validated_data.get("tracking_id"):
            validated_data["tracking_id"] = self._generate_unique_tracking_id()

        return super().create(validated_data)
