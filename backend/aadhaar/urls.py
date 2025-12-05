from django.urls import path
from .views import AadhaarVerifyView

urlpatterns = [
    path("verify/", AadhaarVerifyView.as_view(), name="aadhaar-verify"),
]
