# users/authentication.py
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class KindeAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
            
        try:
            token = auth_header.split(' ')[1]  # Bearer <token>
            
            # Verify token with Kinde's userinfo endpoint
            user_info = self.verify_kinde_token(token)
            
            # Get or create user
            user = self.get_or_create_user(user_info)
            
            return (user, token)
            
        except Exception as e:
            print(f"Auth error: {e}")
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')
    
    def verify_kinde_token(self, token):
        """Verify the token with Kinde's userinfo endpoint"""
        try:
            response = requests.get(
                f'{settings.KINDE_ISSUER_URL}/oauth2/user_profile',
                headers={
                    'Authorization': f'Bearer {token}',
                },
                timeout=10
            )
            
            print(f"Kinde API response status: {response.status_code}")
            
            if response.status_code != 200:
                raise AuthenticationFailed(f'Invalid token: {response.status_code}')
                
            user_info = response.json()
            print(f"User info from Kinde: {user_info}")
            return user_info
            
        except requests.RequestException as e:
            print(f"Kinde API request failed: {e}")
            raise AuthenticationFailed('Unable to verify token')
    
    def get_or_create_user(self, user_info):
        """Get or create user based on Kinde user info"""
        kinde_id = user_info.get('id')  # Use 'id' instead of 'sub'
        email = user_info.get('preferred_email') or user_info.get('email')  # Check both fields
        
        print(f"Looking for email in: {user_info}")  # Debug
        
        if not email:
            raise AuthenticationFailed(f'Email not found in token. Available fields: {list(user_info.keys())}')
        
        try:
            user = User.objects.get(kinde_id=kinde_id)
            print(f"Found existing user: {user.email}")
        except User.DoesNotExist:
            # Create new user
            user = User.objects.create(
                kinde_id=kinde_id,
                email=email,
                username=email,
                first_name=user_info.get('first_name', ''),
                last_name=user_info.get('last_name', ''),
                is_verified=user_info.get('email_verified', False)
            )
            
            # Create user profile
            from .models import UserProfile
            UserProfile.objects.create(user=user)
            print(f"Created new user: {user.email}")
        
        return user