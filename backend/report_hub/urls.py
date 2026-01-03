from django.contrib import admin
from django.urls import path, include
from report.views import PublicIssueReportDetailView
from django.conf import settings
from report_hub.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/reports/', include('report.urls')),
    path('api/profile/', include('user_profile.urls')),
    path('api/aadhaar/', include('aadhaar.urls')),

    path('track/detail/<str:tracking_id>/', 
         PublicIssueReportDetailView.as_view(), 
         name='report-detail'),
]

urlpatterns.append(
    path('api/health', health_check)
)