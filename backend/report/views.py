# report/views.py
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import IssueReport
from .serializers import IssueReportSerializer
from user_profile.models import UserProfile


class IssueReportListCreateView(generics.ListCreateAPIView):
    queryset = IssueReport.objects.all().order_by("-updated_at")
    serializer_class = IssueReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # Get / create profile
        profile, _ = UserProfile.objects.get_or_create(user=user)

        # 1️⃣ Block if Aadhaar not verified
        if not profile.is_aadhaar_verified or not profile.aadhaar:
            raise PermissionDenied(
                "Aadhaar verification is required before creating a report."
            )

        aadhaar = profile.aadhaar

        # 2️⃣ Decide name parts from Aadhaar
        first_name = aadhaar.first_name or aadhaar.full_name.split(" ")[0]
        middle_name = aadhaar.middle_name or ""
        last_name = aadhaar.last_name or (
            " ".join(aadhaar.full_name.split(" ")[1:]) if " " in aadhaar.full_name else ""
        )

        # 3️⃣ Save report with locked-in Aadhaar name + user
        serializer.save(
            user=user,
            reporter_first_name=first_name,
            reporter_middle_name=middle_name or None,
            reporter_last_name=last_name or first_name,  # fallback if needed
        )
