from django.contrib import admin

from .models import ExportCountry, Industry, MarketRegion, Office, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "has_image", "is_published", "sort_order")
    list_filter = ("category", "is_published")
    search_fields = ("title", "slug", "category__name")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("category",)

    @admin.display(boolean=True, description="Image")
    def has_image(self, obj):
        return bool(obj.image)


@admin.register(ExportCountry)
class ExportCountryAdmin(admin.ModelAdmin):
    list_display = ("name", "subtitle", "region", "is_published", "sort_order")
    list_filter = ("region", "is_published")
    search_fields = ("name", "slug", "subtitle")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(MarketRegion)
class MarketRegionAdmin(admin.ModelAdmin):
    list_display = ("name", "is_published", "sort_order")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Office)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ("region", "email", "is_published")
    search_fields = ("region", "email")


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ("name", "compliance_tag", "is_published", "sort_order")
    list_filter = ("is_published",)
    search_fields = ("name", "slug", "compliance_tag")
    prepopulated_fields = {"slug": ("name",)}
