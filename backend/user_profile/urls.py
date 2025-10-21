from django.urls import path
from .views import UserProfileView

urlpatterns = [
    path('', UserProfileView.as_view(), name='profile-management'),
]