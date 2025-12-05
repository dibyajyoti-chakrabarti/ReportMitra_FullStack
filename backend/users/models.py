from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    kinde_id = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)

    # keep these overrides so Django auth works properly
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='customuser_set',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_set',
        related_query_name='user',
    )

    def __str__(self):
        return self.email
