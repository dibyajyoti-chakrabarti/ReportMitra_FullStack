# users/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # OTP endpoints
    path('request-otp/', views.request_otp_view, name='request-otp'),
    path('verify-otp/', views.verify_otp_view, name='verify-otp'),
    
    # Google OAuth
    path('google-auth/', views.google_auth_view, name='google-auth'),
    
    # User endpoints
    path('me/', views.current_user_view, name='current-user'),
    path('profile/', views.user_profile, name='user-profile'),
    path('change-password/', views.change_password_view, name='change-password'),
    path('verify/', views.verify_user, name='verify-user'),
]