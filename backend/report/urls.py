from django.urls import path
from .views import IssueReportListCreateView, presign_s3
from .views import presign_get_for_track

urlpatterns = [
    path("", IssueReportListCreateView.as_view(), name="report-management"),
    path("s3/presign/", presign_s3, name="presign-s3"),
]

urlpatterns += [
    path("<int:id>/presign-get/", presign_get_for_track),
]
