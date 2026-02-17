from django.http import JsonResponse
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

def health_check(request):
    return JsonResponse({"status": "ok"})
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["GET"])
@permission_classes([AllowAny])
def reverse_geocode(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")

    if not lat or not lon:
        return Response(
            {"error": "lat and lon are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "format": "jsonv2",
        "lat": lat,
        "lon": lon,
        "accept-language": "en",
    }
    headers = {
        "User-Agent": "ReportMitra/1.0 (contact@reportmitra.in)"
    }

    try:
        res = requests.get(url, params=params, headers=headers, timeout=5)
        res.raise_for_status()
        return Response(res.json())
    except requests.RequestException:
        return Response(
            {"error": "Reverse geocoding failed"},
            status=status.HTTP_502_BAD_GATEWAY
        )
