from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_email_verified",
            "auth_method",
            "google_id",
            "profile_picture",
        ]
        read_only_fields = ["id", "is_email_verified", "auth_method"]