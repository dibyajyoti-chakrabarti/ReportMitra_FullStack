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
        # Check if user has a profile
        try:
            user_profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError(
                {'detail': 'Please complete your profile before submitting reports.'}
            )

        serializer.save(
            user=self.request.user, 
            reporter_first_name=user_profile.first_name,
            reporter_middle_name=user_profile.middle_name,
            reporter_last_name=user_profile.last_name
        )

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

class IssueReportDetailView(generics.RetrieveAPIView):
    serializer_class = IssueReportSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return IssueReport.objects.filter(user=self.request.user)