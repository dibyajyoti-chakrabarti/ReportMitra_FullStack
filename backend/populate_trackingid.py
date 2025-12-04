import os
import sys
import django
import random
import string

# Get the current directory (where this script is)
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add it to Python path
sys.path.append(current_dir)

# Setup Django with the correct settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'report_hub.settings')

try:
    django.setup()
    print("✅ Django setup successful!")
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    print("\nDebug info:")
    print(f"Current directory: {current_dir}")
    print(f"Python path: {sys.path}")
    print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    sys.exit(1)

from report.models import IssueReport

def generate_tracking_id():
    """Generate 8-character tracking ID"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=8))

def main():
    print("\n" + "="*50)
    print("POPULATING TRACKING IDs FOR EXISTING REPORTS")
    print("="*50)
    
    try:
        # Test database connection
        total_reports = IssueReport.objects.count()
        print(f"📊 Total reports in database: {total_reports}")
        
        # Get reports without tracking_id
        reports = IssueReport.objects.filter(tracking_id__isnull=True)
        to_update = reports.count()
        print(f"🔧 Reports needing tracking IDs: {to_update}")
        
        if to_update == 0:
            print("✅ All reports already have tracking IDs!")
            return
        
        print(f"\n⏳ Generating tracking IDs...")
        
        updated = 0
        for i, report in enumerate(reports, 1):
            # Generate unique tracking ID
            tracking_id = generate_tracking_id()
            while IssueReport.objects.filter(tracking_id=tracking_id).exists():
                tracking_id = generate_tracking_id()
            
            # Update the report
            report.tracking_id = tracking_id
            report.save(update_fields=['tracking_id'])
            updated += 1
            
            # Show progress
            if i % 10 == 0 or i == to_update:
                print(f"   Progress: {i}/{to_update} ({int(i/to_update*100)}%)")
        
        print(f"\n✅ SUCCESS: Updated {updated} reports with tracking IDs!")
        
        # Show sample
        print("\n📋 Sample tracking IDs created:")
        print("-" * 30)
        sample = IssueReport.objects.filter(tracking_id__isnull=False)[:5]
        for report in sample:
            print(f"  Report #{report.id}: {report.tracking_id}")
        print("-" * 30)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()