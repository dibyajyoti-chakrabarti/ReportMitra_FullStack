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
    trust_score = serializers.IntegerField(source="user.trust_score", read_only=True)
    deactivated_until = serializers.DateTimeField(
        source="user.deactivated_until", read_only=True
    )
    is_temporarily_deactivated = serializers.BooleanField(
        source="user.is_temporarily_deactivated",
        read_only=True,
    )

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "aadhaar",
            "is_aadhaar_verified",
            "trust_score",
            "deactivated_until",
            "is_temporarily_deactivated",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
