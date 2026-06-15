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
        return (
            Product.objects.filter(is_published=True)
            .select_related("category")
            .order_by("sort_order", "title")
        )


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(is_published=True).select_related("category")


class ExportCountryListView(generics.ListAPIView):
    serializer_class = ExportCountrySerializer

    def get_queryset(self):
        return (
            ExportCountry.objects.filter(is_published=True)
            .select_related("region")
            .order_by("sort_order", "name")
        )


class ExportCountryDetailView(generics.RetrieveAPIView):
    serializer_class = ExportCountrySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return ExportCountry.objects.filter(is_published=True).select_related("region")


class MarketListView(generics.ListAPIView):
    serializer_class = MarketRegionSerializer

    def get_queryset(self):
        return (
            MarketRegion.objects.filter(is_published=True)
            .prefetch_related("export_countries")
            .order_by("sort_order", "name")
        )


class MarketDetailView(generics.RetrieveAPIView):
    serializer_class = MarketRegionSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return MarketRegion.objects.filter(is_published=True).prefetch_related("export_countries")


class OfficeListView(generics.ListAPIView):
    serializer_class = OfficeSerializer

    def get_queryset(self):
        return Office.objects.filter(is_published=True).order_by("sort_order", "region")


class OfficeDetailView(generics.RetrieveAPIView):
    serializer_class = OfficeSerializer

    def get_queryset(self):
        return Office.objects.filter(is_published=True).order_by("sort_order", "region")


class HealthView(APIView):
    throttle_classes = []

    def get(self, request):
        return Response({"status": "ok", "service": "sundaram-export-api"})
