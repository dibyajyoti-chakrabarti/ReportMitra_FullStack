# user_profile/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import UserProfile
from .serializers import UserProfileSerializer


class MyProfileView(APIView):
    """
    GET /api/profile/me/

    Returns the current user's combined profile:
    - user (email, kinde_id, is_email_verified)
    - is_aadhaar_verified
    - aadhaar info (if linked)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Create a profile lazily if it doesn't exist
        profile, _created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
