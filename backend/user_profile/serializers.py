from rest_framework import serializers
from user_profile.models import UserProfile
from aadhaar.models import AadhaarDatabase

class AadhaarSerializer(serializers.ModelSerializer):
    class Meta:
        model = AadhaarDatabase
        fields = [
            "aadhaar_number",
            "full_name",
            "date_of_birth",
            "address",
            "gender",
            "phone_number",
            "first_name",
            "middle_name",
            "last_name",
            "created_at",
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    aadhaar = AadhaarSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "aadhaar",
            "is_aadhaar_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
