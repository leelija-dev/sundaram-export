from rest_framework import serializers

from catalog.models import Product

from .models import Inquiry


class InquiryCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=Inquiry.InquiryType.choices)
    name = serializers.CharField(max_length=200)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=64, required=False, allow_blank=True)
    message = serializers.CharField()
    origin = serializers.CharField(max_length=200, required=False, allow_blank=True)
    destination = serializers.CharField(max_length=200, required=False, allow_blank=True)
    product_slug = serializers.SlugField(required=False, allow_blank=True)
    incoterms = serializers.CharField(max_length=120, required=False, allow_blank=True)
    volume = serializers.CharField(max_length=200, required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs.get("website"):
            raise serializers.ValidationError("Spam detected.")

        for field in ("origin", "destination", "company", "phone", "incoterms", "volume"):
            if field in attrs and isinstance(attrs[field], str):
                attrs[field] = attrs[field].strip()

        product_slug = (attrs.get("product_slug") or "").strip()
        if product_slug in ("", "other"):
            attrs["product_slug"] = ""
        else:
            attrs["product_slug"] = product_slug
            if not Product.objects.filter(slug=product_slug, is_published=True).exists():
                raise serializers.ValidationError(
                    {"product_slug": "Unknown or unpublished product."}
                )

        inquiry_type = attrs.get("type")
        if inquiry_type == Inquiry.InquiryType.QUOTE:
            if not attrs.get("origin") or not attrs.get("destination"):
                raise serializers.ValidationError(
                    "Origin and destination are required for quote requests."
                )
        return attrs

    def create(self, validated_data):
        validated_data.pop("website", None)

        product = None
        product_slug = validated_data.pop("product_slug", "") or ""
        if product_slug:
            product = Product.objects.filter(slug=product_slug, is_published=True).first()

        inquiry = Inquiry.objects.create(
            inquiry_type=validated_data["type"],
            name=validated_data["name"],
            company=validated_data.get("company", ""),
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
            origin=validated_data.get("origin", ""),
            destination=validated_data.get("destination", ""),
            product=product,
            incoterms=validated_data.get("incoterms", ""),
            volume=validated_data.get("volume", ""),
            message=validated_data["message"],
        )
        return inquiry


class InquiryResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "inquiry_type", "status", "created_at"]
