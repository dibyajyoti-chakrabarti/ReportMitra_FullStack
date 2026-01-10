# report_hub/views.py
#This is an additional line in a new TEST PUSH
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})
