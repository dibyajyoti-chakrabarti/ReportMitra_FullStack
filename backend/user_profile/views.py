from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response(
            {'detail': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    def post(self, request, *args, **kwargs):
        # if profile exists
        if self.get_object():
            return Response(
                {'detail': 'Profile already exists. Use PUT to update.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the profile with the current user
        profile_data = request.data.copy()
        profile = UserProfile.objects.create(
            user=request.user,
            first_name=profile_data.get('first_name', ''),
            middle_name=profile_data.get('middle_name', ''),
            last_name=profile_data.get('last_name', ''),
            mobile_number=profile_data.get('mobile_number', ''),
            is_aadhar_verified=profile_data.get('is_aadhar_verified', False)
        )
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(
                {'detail': 'Profile not found. Use POST to create.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)