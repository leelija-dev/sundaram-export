from django.contrib import admin

from .models import Category, Currency


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "symbol", "is_active", "sort_order")
    list_filter = ("is_active",)
    search_fields = ("code", "name")
    list_editable = ("is_active", "sort_order")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "sort_order")
    list_filter = ("is_active",)
    search_fields = ("name",)
    list_editable = ("is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
