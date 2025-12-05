# user_profile/urls.py
from django.urls import path
from .views import MyProfileView

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
]
