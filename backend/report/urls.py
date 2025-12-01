from django.urls import path
from .views import IssueReportListCreateView, presign_s3

urlpatterns = [
    path("", IssueReportListCreateView.as_view(), name="report-management"),
    path("s3/presign/", presign_s3, name="presign-s3"),
]
