"""
Celery Configuration for Report Hub

This file configures Celery for async background operations.
"""

import os
from celery import Celery

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'report_hub.settings.local'))

# Create Celery app
app = Celery('report_hub')

# Load config from Django settings with CELERY namespace
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configure Celery for production-safe operation
app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    broker_connection_retry_on_startup=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)

# Auto-discover tasks from all registered Django apps
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task to test Celery setup"""
    print(f'Request: {self.request!r}')
