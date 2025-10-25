from django.db import models

class AadhaarDatabase(models.Model):
    aadhaar_number = models.CharField(max_length=12, unique=True, primary_key=True)
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.aadhaar_number} - {self.full_name}"