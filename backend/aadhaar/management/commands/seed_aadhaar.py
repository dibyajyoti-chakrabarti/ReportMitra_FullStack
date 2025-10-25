from django.core.management.base import BaseCommand
from aadhaar.models import AadhaarDatabase
from datetime import date

class Command(BaseCommand):
    help = 'Seed Aadhaar database with dummy data'

    def handle(self, *args, **options):
        dummy_data = [
            {
                'aadhaar_number': '123456789012',
                'full_name': 'Rajesh Kumar',
                'date_of_birth': date(1985, 5, 15),
                'address': '123 MG Road, Bangalore, Karnataka - 560001',
                'gender': 'M'
            },
            {
                'aadhaar_number': '234567890123', 
                'full_name': 'Priya Sharma',
                'date_of_birth': date(1990, 8, 22),
                'address': '456 Koramangala, Bangalore, Karnataka - 560034',
                'gender': 'F'
            },
            {
                'aadhaar_number': '345678901234',
                'full_name': 'Amit Patel',
                'date_of_birth': date(1988, 12, 5),
                'address': '789 Whitefield, Bangalore, Karnataka - 560066',
                'gender': 'M'
            }
        ]

        for data in dummy_data:
            AadhaarDatabase.objects.get_or_create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully seeded Aadhaar database'))