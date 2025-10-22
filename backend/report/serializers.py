from rest_framework import serializers
from .models import IssueReport

class IssueReportSerializer(serializers.ModelSerializer):
    reporter_full_name = serializers.ReadOnlyField(source='get_reporter_full_name')
    
    class Meta:
        model = IssueReport
        fields = [
            'id', 'reporter_first_name', 'reporter_middle_name', 'reporter_last_name',
            'reporter_full_name', 'issue_title', 'location', 'issue_description',
            'image_url', 'issue_date', 'status', 'updated_at'
        ]
        read_only_fields = [
            'id', 'reporter_first_name', 'reporter_middle_name', 'reporter_last_name',
            'reporter_full_name', 'issue_date', 'status', 'updated_at'
        ]
