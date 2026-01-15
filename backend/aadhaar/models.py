from django.db import models

class AadhaarDatabase(models.Model):
    aadhaar_number = models.CharField(
        max_length=12,
        primary_key=True,
    )

    first_name = models.CharField(max_length=50, null=True, blank=True)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    address = models.TextField()
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aadhaar_number} - {self.full_name}"
