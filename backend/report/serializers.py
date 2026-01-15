from django.utils.crypto import get_random_string
from rest_framework import serializers
from .models import IssueReport


class IssueReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReport
        fields = "__all__"
        read_only_fields = ("id", "issue_date", "updated_at", "status", "user", "tracking_id")

    def _generate_unique_tracking_id(self) -> str:
        """
        Generate an 8-character unique tracking ID like 'A9F2K7Q1'.
        """
        allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        while True:
            tid = get_random_string(8, allowed_chars)
            if not IssueReport.objects.filter(tracking_id=tid).exists():
                return tid

    def create(self, validated_data):
        """
        - Attach request.user
        - Expect frontend to send a raw S3 object key in `image_url`
        - Generate a unique tracking_id
        """

        request = self.context.get("request")
        if request and getattr(request, "user", None) and request.user.is_authenticated:
            validated_data.setdefault("user", request.user)

        if not validated_data.get("tracking_id"):
            validated_data["tracking_id"] = self._generate_unique_tracking_id()

        return super().create(validated_data)
    
    def validate_image_url(self, value):
        if value.startswith("http"):
            raise serializers.ValidationError(
                "image_url must be an S3 object key, not a full URL"
            )
        return value

class IssueHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReport
        fields = (
            "tracking_id",
            "issue_title",
            "location",
            "status",
        )
