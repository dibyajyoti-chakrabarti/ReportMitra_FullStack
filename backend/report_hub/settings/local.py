from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        # REMOVED: "users.authentication.KindeAuthentication",
        # Temporarily empty - will add JWT in Phase 2
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        # TEMPORARILY COMMENT THIS OUT so you can test without auth
        # "rest_framework.permissions.IsAuthenticated",
        "rest_framework.permissions.AllowAny",  # Temporary for testing
    ],
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}