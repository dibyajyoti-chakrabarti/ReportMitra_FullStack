from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.user_profile, name='user-profile'),
    path('verify/', views.verify_user, name='verify-user'),
]