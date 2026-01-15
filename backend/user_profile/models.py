from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_profile",
    )

    aadhaar = models.OneToOneField(
        "aadhaar.AadhaarDatabase",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="linked_profile",
    )

    is_aadhaar_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.email}"
