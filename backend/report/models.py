from django.db import models
from django.conf import settings

class IssueReport(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("rejected", "Rejected"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]
    APPEAL_STATUS_CHOICES = [
        ("not_appealed", "Not Appealed"),
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports",
    )

    issue_title = models.CharField(max_length=80, default="Issue Report")
    location = models.CharField(max_length=500)
    issue_description = models.TextField(max_length=500)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    completion_url = models.CharField(max_length=1000, null=True, blank=True)
    issue_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    updated_at = models.DateTimeField(auto_now=True)
    tracking_id = models.CharField(max_length=8, unique=True, editable=False, blank=False,default="TEMP0001")
    department = models.TextField(max_length=30,default="Manual")
    confidence_score = models.FloatField(null = False,default=0.0)
    allocated_to = models.TextField(max_length=10,blank=True)
    appeal_status = models.CharField(
        max_length=20,
        choices=APPEAL_STATUS_CHOICES,
        default="not_appealed",
    )
    trust_score_delta = models.IntegerField(default=0)
    
    # Social Features
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_reports', blank=True)
    dislikes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='disliked_reports', blank=True)
    
    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.tracking_id} @ {self.location} - {self.get_status_display()}"

class Comment(models.Model):
    report = models.ForeignKey(IssueReport, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.user} on {self.report.tracking_id}"
