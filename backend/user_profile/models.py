from datetime import date
from django.db import models
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='user_profile'
    )
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    mobile_number = PhoneNumberField(unique=True,region = 'IN',default='000')
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    is_aadhar_verified = models.BooleanField(default=False)
    aadhaar_number = models.CharField(max_length=12, blank=True, null=True, unique=True)
    date_of_birth = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.user.email}"

    def get_full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    def calculate_age(self):
        """Calculate age from date of birth"""
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None

    def save(self, *args, **kwargs):
        """Auto-calculate age before saving"""
        if self.date_of_birth:
            self.age = self.calculate_age()
        super().save(*args, **kwargs)