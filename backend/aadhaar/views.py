from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, serializers

from .models import AadhaarDatabase
from user_profile.models import UserProfile


class AadhaarVerifyView(APIView):
    """
    POST /api/aadhaar/verify/

    Body: { "aadhaar_number": "123412341234" }

    - Checks Aadhaar exists in AadhaarDatabase.
    - Ensures the Aadhaar is not linked to some other user.
    - Creates/gets UserProfile for the current user.
    - Links Aadhaar to profile and marks is_aadhaar_verified = True.
    - Once linked, the user cannot switch to a different Aadhaar.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        aadhaar_number = request.data.get("aadhaar_number")

        if not aadhaar_number:
            return Response(
                {"detail": "aadhaar_number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Basic sanity check: 12 digits (you can relax this if needed)
        if not aadhaar_number.isdigit() or len(aadhaar_number) != 12:
            return Response(
                {"detail": "Invalid Aadhaar number format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1) Aadhaar must exist in sandbox DB
        try:
            aadhaar_record = AadhaarDatabase.objects.get(
                aadhaar_number=aadhaar_number
            )
        except AadhaarDatabase.DoesNotExist:
            return Response(
                {"detail": "Aadhaar number not found in sandbox database."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user

        # 2) Check if this Aadhaar is already linked to some OTHER user
        existing_profile_for_aadhaar = (
            UserProfile.objects.filter(aadhaar=aadhaar_record)
            .exclude(user=user)
            .first()
        )
        if existing_profile_for_aadhaar:
            return Response(
                {"detail": "This Aadhaar number is already linked to another account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3) Get or create the current user's profile
        profile, _created = UserProfile.objects.get_or_create(user=user)

        # 4) If user already linked to a DIFFERENT Aadhaar, block change
        if profile.aadhaar and profile.aadhaar != aadhaar_record:
            return Response(
                {
                    "detail": "Your account is already linked to a different Aadhaar "
                    "and cannot be changed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 5) Link Aadhaar to this profile (idempotent if same)
        profile.aadhaar = aadhaar_record
        profile.is_aadhaar_verified = True
        profile.save()

        # Build response payload
        aadhaar_data = {
            "aadhaar_number": aadhaar_record.aadhaar_number,
            "first_name": aadhaar_record.first_name,
            "middle_name": aadhaar_record.middle_name,
            "last_name": aadhaar_record.last_name,
            "full_name": aadhaar_record.full_name,
            "phone_number": aadhaar_record.phone_number,
            "date_of_birth": aadhaar_record.date_of_birth,
            "address": aadhaar_record.address,
            "gender": aadhaar_record.gender,
        }

        profile_data = {
            "is_aadhaar_verified": profile.is_aadhaar_verified,
            "aadhaar_number": aadhaar_record.aadhaar_number,
        }

        return Response(
            {
                "verified": True,
                "aadhaar_linked": True,
                "aadhaar_data": aadhaar_data,
                "profile": profile_data,
            },
            status=status.HTTP_200_OK,
        )
