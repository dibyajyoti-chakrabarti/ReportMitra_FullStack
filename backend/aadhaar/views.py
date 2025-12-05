from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import AadhaarDatabase
from user_profile.models import UserProfile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_aadhaar(request):
    aadhaar_number = request.data.get('aadhaar_number')

    if not aadhaar_number:
        return Response(
            {'error': 'Aadhaar number is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 1) Check Aadhaar exists in sandbox
    try:
        aadhaar_record = AadhaarDatabase.objects.get(aadhaar_number=aadhaar_number)
    except AadhaarDatabase.DoesNotExist:
        return Response(
            {
                'verified': False,
                'error': 'Aadhaar number not found in database'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # 2) Get or create profile for this user
    user_profile, created = UserProfile.objects.get_or_create(user=request.user)

    # 3) If this profile already has a verified Aadhaar, do NOT allow changes
    if user_profile.is_aadhaar_verified:
        # if it's already linked to the same Aadhaar, just return success
        if user_profile.aadhaar == aadhaar_record:
            pass  # no change needed
        else:
            return Response(
                {
                    'verified': False,
                    'error': 'Aadhaar already linked for this account and cannot be changed.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    # 4) Ensure this Aadhaar is not linked to some other user
    from user_profile.models import UserProfile as UP  # just for clarity
    existing_profile = UP.objects.filter(aadhaar=aadhaar_record).exclude(user=request.user).first()
    if existing_profile:
        return Response(
            {
                'verified': False,
                'error': 'This Aadhaar number is already linked to another account.'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # 5) Link Aadhaar to this profile and mark verified
    user_profile.aadhaar = aadhaar_record
    user_profile.is_aadhaar_verified = True
    user_profile.save()

    # 6) Optionally split full name for frontend display
    name_parts = aadhaar_record.full_name.split(' ')
    first_name = name_parts[0] if name_parts else ''
    middle_name = name_parts[1] if len(name_parts) > 2 else ''
    last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else first_name

    return Response(
        {
            'verified': True,
            'aadhaar_linked': True,
            'aadhaar_data': {
                'aadhaar_number': aadhaar_record.aadhaar_number,
                'full_name': aadhaar_record.full_name,
                'first_name': first_name,
                'middle_name': middle_name,
                'last_name': last_name,
                'date_of_birth': aadhaar_record.date_of_birth,
                'address': aadhaar_record.address,
                'gender': aadhaar_record.gender,
            },
            'profile': {
                'is_aadhaar_verified': user_profile.is_aadhaar_verified,
            }
        },
        status=status.HTTP_200_OK
    )
