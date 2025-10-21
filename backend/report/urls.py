from django.urls import path
from .views import IssueReportListCreateView, IssueReportDetailView

urlpatterns = [
    path('', IssueReportListCreateView.as_view(), name='report-management'),
    path('<int:id>/', IssueReportDetailView.as_view(), name='report-detail'),
]