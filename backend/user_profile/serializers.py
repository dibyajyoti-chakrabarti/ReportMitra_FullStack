# user_profile/serializers.py
from rest_framework import serializers
from users.models import CustomUser
from aadhaar.models import AadhaarDatabase
from .models import UserProfile


class CustomUserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "email", "kinde_id", "is_email_verified")


class AadhaarSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = AadhaarDatabase
        fields = (
            "aadhaar_number",
            "first_name",
            "middle_name",
            "last_name",
            "full_name",
            "phone_number",
            "date_of_birth",
            "address",
            "gender",
        )


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Combined view of:
      - auth user info
      - profile info
      - linked Aadhaar info
    """

    user = CustomUserSummarySerializer(read_only=True)
    aadhaar = AadhaarSummarySerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = (
            "id",
            "user",
            "is_aadhaar_verified",
            "aadhaar",
            "created_at",
            "updated_at",
        )
