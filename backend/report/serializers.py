from rest_framework import serializers
from .models import IssueReport

class IssueReportSerializer(serializers.ModelSerializer):
    reporter_full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = IssueReport
        fields = '__all__'
        read_only_fields = [
            'id', 'reporter_first_name', 'reporter_middle_name', 'reporter_last_name',
            'reporter_full_name', 'issue_date', 'status', 'updated_at'
        ]