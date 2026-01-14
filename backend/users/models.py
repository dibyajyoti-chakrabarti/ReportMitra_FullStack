from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

class CustomUserManager(BaseUserManager):
    """Custom user manager where email is the unique identifier"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password"""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        
        if 'username' not in extra_fields or not extra_fields.get('username'):
            extra_fields['username'] = email.split('@')[0]
            base_username = extra_fields['username']
            counter = 1
            while self.model.objects.filter(username=extra_fields['username']).exists():
                extra_fields['username'] = f"{base_username}{counter}"
                counter += 1
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_email_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):

    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    profile_picture = models.URLField(max_length=500, null=True, blank=True)
    
    AUTH_METHOD_CHOICES = [
        ('email', 'Email/JWT'),
        ('google', 'Google OAuth'),
    ]
    auth_method = models.CharField(
        max_length=10, 
        choices=AUTH_METHOD_CHOICES, 
        default='email'
    )
    
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='customuser_set',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_set',
        related_query_name='user',
    )

    def __str__(self):
        return self.email


class EmailOTP(models.Model):
    """Model to store email OTP for authentication"""
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} - {self.otp}"
    
    def is_valid(self):
        """Check if OTP is still valid"""
        return not self.is_used and timezone.now() < self.expires_at
    
    @classmethod
    def generate_otp(cls, email):
        """Generate a new 6-digit OTP"""
        otp = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timedelta(minutes=10)
        
        cls.objects.filter(email=email, is_used=False).update(is_used=True)
        
        otp_obj = cls.objects.create(
            email=email,
            otp=otp,
            expires_at=expires_at
        )
        return otp_obj