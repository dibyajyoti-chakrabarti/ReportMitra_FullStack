from django.urls import path
from .views import IssueReportListCreateView, presign_s3, presign_get_for_track

urlpatterns = [
    path("", IssueReportListCreateView.as_view(), name="report-management"),
    path("s3/presign/", presign_s3, name="presign-s3"),
    path("<int:id>/presign-get/", presign_get_for_track, name="presign-get"),
]
