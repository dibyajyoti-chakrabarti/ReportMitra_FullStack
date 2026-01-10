from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    "api.reportmitra.in",
    ".reportmitra.in",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

CSRF_TRUSTED_ORIGINS = [
    "https://api.reportmitra.in",
    "https://reportmitra.in",
    "https://www.reportmitra.in",
    "https://admin.reportmitra.in",
]

CORS_ALLOWED_ORIGINS = [
    "https://reportmitra.in",
    "https://www.reportmitra.in",
    "https://admin.reportmitra.in",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SAMESITE = "None"
