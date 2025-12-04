"""
URL configuration for report_hub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from report.views import PublicIssueReportDetailView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/reports/', include('report.urls')),
    path('api/profile/', include('user_profile.urls')),
    path('api/aadhaar/', include('aadhaar.urls')),
    path('track/detail/<str:tracking_id>/', PublicIssueReportDetailView.as_view(), name='report-detail'),
]
