# test_tracking.py
import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'report_hub.settings')
django.setup()

from report.models import IssueReport
from django.contrib.auth import get_user_model

def test_tracking_system():
    print("🧪 Testing Tracking ID System...")
    print("="*50)
    
    # 1. Check all existing records have tracking IDs
    reports_without_id = IssueReport.objects.filter(tracking_id__isnull=True)
    print(f"1. Reports without tracking_id: {reports_without_id.count()}")
    
    # 2. Check all tracking IDs are unique
    all_reports = IssueReport.objects.all()
    tracking_ids = [r.tracking_id for r in all_reports]
    unique_ids = set(tracking_ids)
    print(f"2. Total reports: {len(tracking_ids)}")
    print(f"   Unique tracking IDs: {len(unique_ids)}")
    print(f"   Duplicates: {'YES' if len(tracking_ids) != len(unique_ids) else 'NO'}")
    
    # 3. Check tracking ID format (8 characters)
    invalid_format = [tid for tid in tracking_ids if tid and len(tid) != 8]
    print(f"3. Invalid format (not 8 chars): {len(invalid_format)}")
    if invalid_format:
        print(f"   Examples: {invalid_format[:3]}")
    
    # 4. Test creating a new report
    User = get_user_model()
    try:
        user = User.objects.first()
        new_report = IssueReport(
            user=user,
            reporter_first_name="Test",
            reporter_last_name="User",
            location="Test Location",
            issue_description="Test description",
            issue_title="Test Issue"
        )
        new_report.save()
        print(f"4. New report created:")
        print(f"   ID: {new_report.id}")
        print(f"   Tracking ID: {new_report.tracking_id}")
        print(f"   Length: {len(new_report.tracking_id)}")
        
        # Clean up test report
        new_report.delete()
        print("   ✓ Test report cleaned up")
    except Exception as e:
        print(f"4. Error creating test report: {e}")
    
    # 5. Test lookup by tracking_id
    if all_reports.exists():
        sample = all_reports.first()
        try:
            found = IssueReport.objects.get(tracking_id=sample.tracking_id)
            print(f"5. Lookup by tracking_id works: {sample.tracking_id} → Report #{found.id}")
        except IssueReport.DoesNotExist:
            print(f"5. ❌ Lookup failed for {sample.tracking_id}")
        except Exception as e:
            print(f"5. ❌ Lookup error: {e}")
    
    print("="*50)
    print("✅ Test complete!")

if __name__ == "__main__":
    test_tracking_system()