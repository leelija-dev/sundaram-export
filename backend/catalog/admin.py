from django.contrib import admin

from .models import ExportCountry, MarketRegion, Office, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_published", "sort_order")
    list_filter = ("category", "is_published")
    search_fields = ("title", "slug", "category__name")
    prepopulated_fields = {"slug": ("title",)}
    raw_id_fields = ("category",)
    autocomplete_fields = ("category",)


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
