from django.urls import path
from .views import IssueReportListCreateView#, IssueReportDetailView

urlpatterns = [
    path('', IssueReportListCreateView.as_view(), name='report-management'),
]   