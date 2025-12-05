from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# ✅ use the profile model & serializer from the user_profile app
from user_profile.models import UserProfile
from user_profile.serializers import UserProfileSerializer


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get or update user profile for the logged-in user"""

    # ✅ works regardless of related_name, creates one if missing
    profile, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_user(request):
    """Mark user as verified (you can add additional verification logic)"""
    request.user.is_verified = True
    request.user.save()
    return Response({'message': 'User verified successfully'})
