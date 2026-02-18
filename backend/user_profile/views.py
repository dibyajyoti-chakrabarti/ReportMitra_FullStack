from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user_profile.models import UserProfile
from user_profile.serializers import UserProfileSerializer
from users.services import evaluate_resolution_incentive

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Return the logged-in user's profile, including linked Aadhaar data (if any).
    """
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    incentive_data = evaluate_resolution_incentive(request.user)
    response_data = serializer.data
    response_data.update(incentive_data)
    return Response(response_data, status=status.HTTP_200_OK)
