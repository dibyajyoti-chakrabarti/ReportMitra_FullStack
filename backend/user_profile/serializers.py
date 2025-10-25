from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    class Meta:
        model = UserProfile
        fields = [
            'id', 'first_name', 'middle_name', 'last_name', 
            'mobile_number', 'date_of_birth', 'age', 'address',
            'is_aadhar_verified', 'aadhaar_number', 'full_name',
            'created_at', 'last_updated_at'
        ]
        read_only_fields = [
            'id', 'age', 'full_name', 'created_at', 'last_updated_at',
            'is_aadhar_verified', 'aadhaar_number']