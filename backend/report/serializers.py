from django.utils.crypto import get_random_string
from rest_framework import serializers
from .models import IssueReport, Comment

class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for comments with full user name support
    """
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'text', 'created_at', 'username', 'full_name']
        read_only_fields = ['id', 'created_at', 'username', 'full_name']
    
    def get_full_name(self, obj):
        """
        Get the full name from the user's profile or user model.
        Tries multiple sources in order of preference.
        """
        try:
            # First, try user's first_name and last_name from CustomUser model
            first_name = getattr(obj.user, 'first_name', '').strip()
            last_name = getattr(obj.user, 'last_name', '').strip()
            
            if first_name or last_name:
                return f"{first_name} {last_name}".strip()
            
            # Second, try userprofile if it exists
            if hasattr(obj.user, 'userprofile'):
                profile = obj.user.userprofile
                first_name = getattr(profile, 'first_name', '').strip()
                last_name = getattr(profile, 'last_name', '').strip()
                
                if first_name or last_name:
                    return f"{first_name} {last_name}".strip()
                
                # Try full_name field if it exists
                full_name = getattr(profile, 'full_name', '').strip()
                if full_name:
                    return full_name
                    
        except Exception as e:
            print(f"Error getting full name for comment: {e}")
        
        # Final fallback to username
        return obj.user.username if hasattr(obj.user, 'username') else obj.user.email


class IssueReportSerializer(serializers.ModelSerializer):
    """
    Serializer for issue reports with social features and user info
    """
    user_name = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    dislikes_count = serializers.IntegerField(source='dislikes.count', read_only=True)
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_disliked = serializers.SerializerMethodField()

    class Meta:
        model = IssueReport
        fields = "__all__"
        read_only_fields = (
            "id", "issue_date", "updated_at", "status", "user", 
            "tracking_id", "likes", "dislikes", "user_name", "username",
            "likes_count", "dislikes_count", "comments_count",
            "appeal_status", "trust_score_delta"
        )

    def get_user_name(self, obj):
        """
        Get the full name of the user who created the report.
        Tries multiple sources in order of preference.
        """
        try:
            # First, try user's first_name and last_name from CustomUser model
            first_name = getattr(obj.user, 'first_name', '').strip()
            last_name = getattr(obj.user, 'last_name', '').strip()
            
            if first_name or last_name:
                return f"{first_name} {last_name}".strip()
            
            # Second, try userprofile if it exists
            if hasattr(obj.user, 'userprofile'):
                profile = obj.user.userprofile
                first_name = getattr(profile, 'first_name', '').strip()
                last_name = getattr(profile, 'last_name', '').strip()
                
                if first_name or last_name:
                    return f"{first_name} {last_name}".strip()
                
                # Try full_name field if it exists
                full_name = getattr(profile, 'full_name', '').strip()
                if full_name:
                    return full_name
                    
        except Exception as e:
            print(f"Error getting user name for report: {e}")
        
        # Final fallback to username or email
        return obj.user.username if hasattr(obj.user, 'username') else obj.user.email

    def get_username(self, obj):
        """Get username"""
        return obj.user.username if hasattr(obj.user, 'username') else obj.user.email

    def get_comments_count(self, obj):
        """Get the count of comments for this issue"""
        return obj.comments.count()

    def get_is_liked(self, obj):
        """Check if the current user has liked this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_disliked(self, obj):
        """Check if the current user has disliked this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.dislikes.filter(id=request.user.id).exists()
        return False

    def _generate_unique_tracking_id(self) -> str:
        allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        while True:
            tid = get_random_string(8, allowed_chars)
            if not IssueReport.objects.filter(tracking_id=tid).exists():
                return tid

    def create(self, validated_data):
        request = self.context.get("request")
        if request and getattr(request, "user", None) and request.user.is_authenticated:
            validated_data.setdefault("user", request.user)

        if not validated_data.get("tracking_id"):
            validated_data["tracking_id"] = self._generate_unique_tracking_id()

        return super().create(validated_data)
    
    def validate_image_url(self, value):
        if value and value.startswith("http"):
            raise serializers.ValidationError(
                "image_url must be an S3 object key, not a full URL"
            )
        return value


class IssueHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for user's issue report history
    Shows a simplified view of their reports
    """
    can_appeal = serializers.SerializerMethodField()

    def get_can_appeal(self, obj):
        return obj.status == "rejected" and obj.appeal_status == "not_appealed"

    class Meta:
        model = IssueReport
        fields = (
            "id",
            "tracking_id",
            "issue_title",
            "location",
            "status",
            "appeal_status",
            "trust_score_delta",
            "can_appeal",
            "issue_date",
            "updated_at",
        )
        read_only_fields = fields
