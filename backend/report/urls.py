from django.urls import path
from .views import (
    IssueReportListCreateView, presign_s3, presign_get_for_track,
    CommunityResolvedIssuesView, UserIssueHistoryView,
    CommentListCreateView, ToggleLikeView, ToggleDislikeView, submit_appeal,
    ReportEligibilityView,
)

urlpatterns = [
    path("", IssueReportListCreateView.as_view(), name="report-management"),
    path("eligibility/", ReportEligibilityView.as_view(), name="report-eligibility"),
    path("s3/presign/", presign_s3, name="presign-s3"),
    path("<int:id>/presign-get/", presign_get_for_track, name="presign-get"),
    path("community/resolved/", CommunityResolvedIssuesView.as_view()),
    path("history/", UserIssueHistoryView.as_view(), name="user-issue-history"),
    path("<int:report_id>/appeal/", submit_appeal, name="report-appeal"),
    
    # Social Endpoints
    path("<int:report_id>/comments/", CommentListCreateView.as_view(), name="report-comments"),
    path("<int:report_id>/like/", ToggleLikeView.as_view(), name="report-like"),
    path("<int:report_id>/dislike/", ToggleDislikeView.as_view(), name="report-dislike"),
]
