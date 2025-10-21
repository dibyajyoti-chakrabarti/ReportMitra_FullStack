from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'full_name']

    def create(self,validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)