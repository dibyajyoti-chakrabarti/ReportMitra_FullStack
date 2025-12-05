from django.urls import path
from .views import verify_aadhaar

urlpatterns = [
    path('verify/', verify_aadhaar, name='verify-aadhaar'),
]
