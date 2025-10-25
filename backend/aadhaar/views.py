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
        return Response({'error': 'Aadhaar number is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        aadhaar_record = AadhaarDatabase.objects.get(aadhaar_number=aadhaar_number)
        
        # Get or create user profile and update with Aadhaar data
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Update profile with Aadhaar verification and data
        user_profile.is_aadhar_verified = True
        user_profile.aadhaar_number = aadhaar_number
        
        # Parse full name into first, middle, last
        name_parts = aadhaar_record.full_name.split(' ')
        user_profile.first_name = name_parts[0] if name_parts else ''
        user_profile.middle_name = name_parts[1] if len(name_parts) > 2 else ''
        user_profile.last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else name_parts[0] if name_parts else ''
        
        # Save address and date of birth from Aadhaar data
        user_profile.address = aadhaar_record.address
        user_profile.date_of_birth = aadhaar_record.date_of_birth
        # Age will be auto-calculated in save() method
        
        user_profile.save()
        
        return Response({
            'verified': True,
            'aadhaar_data': {
                'full_name': aadhaar_record.full_name,
                'date_of_birth': aadhaar_record.date_of_birth,
                'address': aadhaar_record.address,
                'gender': aadhaar_record.gender
            },
            'profile_updated': True
        })
        
    except AadhaarDatabase.DoesNotExist:
        return Response({
            'verified': False,
            'error': 'Aadhaar number not found in database'
        }, status=status.HTTP_404_NOT_FOUND)