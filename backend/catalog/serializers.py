from rest_framework import serializers

from .models import ExportCountry, MarketRegion, Office, Product


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "slug",
            "title",
            "short_description",
            "description",
            "category",
            "hs_code",
            "origins",
            "markets",
            "specifications",
            "packaging",
        ]


class ProductDetailSerializer(ProductListSerializer):
    pass


class ExportCountrySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")
    region_name = serializers.CharField(source="region.name", read_only=True, default="")
    region_id = serializers.CharField(source="region.slug", read_only=True, default="")

    class Meta:
        model = ExportCountry
        fields = [
            "id",
            "name",
            "subtitle",
            "description",
            "key_ports",
            "specialties",
            "region_id",
            "region_name",
        ]


class MarketRegionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug")
    countries = serializers.SerializerMethodField()

    class Meta:
        model = MarketRegion
        fields = [
            "id",
            "name",
            "description",
            "countries",
            "key_ports",
            "specialties",
        ]

    def get_countries(self, obj):
        published = obj.export_countries.filter(is_published=True).order_by("sort_order", "name")
        if published.exists():
            return [c.name for c in published]
        return obj.countries or []


class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ["region", "address", "phone", "email"]
