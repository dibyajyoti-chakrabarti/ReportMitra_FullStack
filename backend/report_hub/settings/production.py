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

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

SECURE_CROSS_ORIGIN_OPENER_POLICY = None

SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SAMESITE = "None"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}