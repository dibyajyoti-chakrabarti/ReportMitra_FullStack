from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from aadhaar.models import AadhaarDatabase
from user_profile.models import UserProfile


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_aadhaar(request):
    """
    Link an Aadhaar number to the logged-in user's profile, if:
    - The Aadhaar exists in AadhaarDatabase
    - It isn't already linked to another user
    """
    aadhaar_number = str((request.data.get("aadhaar_number") or "")).strip()
    if not aadhaar_number.isdigit() or len(aadhaar_number) != 12:
        return Response(
            {"error": "Invalid Aadhaar number format"},
            status=400
        )

    if not aadhaar_number.isdigit() or len(aadhaar_number) != 12:
        return Response(
            {"verified": False, "error": "Please provide a valid 12-digit Aadhaar number."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        aadhaar = AadhaarDatabase.objects.get(aadhaar_number=aadhaar_number)
    except AadhaarDatabase.DoesNotExist:
        return Response(
            {"verified": False, "error": "Aadhaar number not found in the sandbox database."},
            status=status.HTTP_404_NOT_FOUND,
        )

    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    from user_profile.models import UserProfile as ProfileModel
    taken_by_other = ProfileModel.objects.filter(aadhaar=aadhaar).exclude(user=request.user).exists()
    if taken_by_other:
        return Response(
            {
                "verified": False,
                "error": "This Aadhaar number is already linked to another account.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    profile.aadhaar = aadhaar
    profile.is_aadhaar_verified = True
    profile.save()

    return Response(
        {
            "verified": True,
            "aadhaar_number": aadhaar.aadhaar_number,
            "aadhaar": {
                "aadhaar_number": aadhaar.aadhaar_number,
                "full_name": aadhaar.full_name,
                "date_of_birth": aadhaar.date_of_birth,
                "address": aadhaar.address,
                "gender": aadhaar.gender,
                "phone_number": aadhaar.phone_number,
                "first_name": aadhaar.first_name,
                "middle_name": aadhaar.middle_name,
                "last_name": aadhaar.last_name,
            },
            "profile": {
                "is_aadhaar_verified": profile.is_aadhaar_verified,
                "created_at": profile.created_at,
                "updated_at": profile.updated_at,
            },
        },
        status=status.HTTP_200_OK,
    )
