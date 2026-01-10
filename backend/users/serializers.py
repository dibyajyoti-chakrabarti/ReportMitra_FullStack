# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_email_verified",
            "auth_method",
            "google_id",
            "profile_picture",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined", "auth_method"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'password2']

    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def validate_email(self, value):
        """Validate email is unique"""
        if CustomUser.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        """Create new user with email/password"""
        validated_data.pop('password2')
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            auth_method='email',
            is_email_verified=False  # Will be verified later via email
        )
        
        # Create associated UserProfile
        from user_profile.models import UserProfile
        UserProfile.objects.create(user=user)
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True, 
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        """Validate user credentials"""
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        if email and password:
            # Authenticate user
            user = authenticate(
                request=self.context.get('request'),
                username=email,  # Our USERNAME_FIELD is email
                password=password
            )

            if not user:
                raise serializers.ValidationError(
                    'Unable to log in with provided credentials.',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.',
                    code='authorization'
                )

        else:
            raise serializers.ValidationError(
                'Must include "email" and "password".',
                code='authorization'
            )

        attrs['user'] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, 
        write_only=True,
        validators=[validate_password]
    )
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        """Validate passwords match"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                "new_password": "New password fields didn't match."
            })
        return attrs

    def validate_old_password(self, value):
        """Validate old password is correct"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class RequestOTPSerializer(serializers.Serializer):
    """Serializer for requesting OTP"""
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Validate email exists"""
        if not CustomUser.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("No account found with this email address.")
        return value.lower()


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying OTP and logging in"""
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True, max_length=6, min_length=6)

    def validate(self, attrs):
        """Validate OTP"""
        from .models import EmailOTP
        
        email = attrs.get('email', '').lower()
        otp = attrs.get('otp')

        # Get the most recent unused OTP for this email
        try:
            otp_obj = EmailOTP.objects.filter(
                email=email,
                otp=otp,
                is_used=False
            ).latest('created_at')
            
            if not otp_obj.is_valid():
                raise serializers.ValidationError({
                    "otp": "This code has expired. Please request a new one."
                })
            
            # Get user
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError({
                    "email": "No account found with this email."
                })
            
            # Mark OTP as used
            otp_obj.is_used = True
            otp_obj.save()
            
            attrs['user'] = user
            return attrs
            
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({
                "otp": "Invalid code. Please check and try again."
            })