from django.urls import path
from .views import IssueReportListCreateView

urlpatterns = [
    path('', IssueReportListCreateView.as_view(), name='report-management'),
]   