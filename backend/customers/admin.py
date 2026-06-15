from django.contrib import admin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("company_name", "contact_name", "email", "status", "customer_type", "export_country")
    list_filter = ("status", "customer_type", "export_country")
    search_fields = ("company_name", "contact_name", "email", "phone")
