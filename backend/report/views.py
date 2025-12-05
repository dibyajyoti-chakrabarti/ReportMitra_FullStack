from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import IssueReport
from .serializers import IssueReportSerializer
from user_profile.models import UserProfile

class IssueReportListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IssueReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Fetch profile + linked Aadhaar
        try:
            user_profile = UserProfile.objects.select_related("aadhaar").get(user=self.request.user)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Please link and verify your Aadhaar before submitting reports."}
            )

        # Ensure Aadhaar is linked and verified
        if not getattr(user_profile, "aadhaar", None) or not getattr(user_profile, "is_aadhaar_verified", False):
            raise serializers.ValidationError(
                {"detail": "Please link and verify your Aadhaar before submitting reports."}
            )

        # Get name from Aadhaar full_name and split
        full_name = user_profile.aadhaar.full_name or ""
        name_parts = full_name.split()

        reporter_first_name = name_parts[0] if name_parts else ""
        reporter_middle_name = ""
        reporter_last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        serializer.save(
            user=self.request.user,
            reporter_first_name=reporter_first_name,
            reporter_middle_name=reporter_middle_name,
            reporter_last_name=reporter_last_name,
        )

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
