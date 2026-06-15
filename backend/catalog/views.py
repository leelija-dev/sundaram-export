from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ExportCountry, MarketRegion, Office, Product
from .serializers import (
    ExportCountrySerializer,
    MarketRegionSerializer,
    OfficeSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(is_published=True)


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(is_published=True)


class ExportCountryListView(generics.ListAPIView):
    serializer_class = ExportCountrySerializer

    def get_queryset(self):
        return ExportCountry.objects.filter(is_published=True).select_related("region")


class ExportCountryDetailView(generics.RetrieveAPIView):
    serializer_class = ExportCountrySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return ExportCountry.objects.filter(is_published=True).select_related("region")


class MarketListView(generics.ListAPIView):
    serializer_class = MarketRegionSerializer

    def get_queryset(self):
        return MarketRegion.objects.filter(is_published=True).prefetch_related("export_countries")


class MarketDetailView(APIView):
    def get(self, request, slug):
        try:
            market = MarketRegion.objects.get(slug=slug, is_published=True)
        except MarketRegion.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)
        return Response(MarketRegionSerializer(market).data)


class OfficeListView(generics.ListAPIView):
    serializer_class = OfficeSerializer

    def get_queryset(self):
        return Office.objects.filter(is_published=True)


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok", "service": "sundaram-export-api"})
