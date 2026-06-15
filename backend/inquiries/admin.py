from django.contrib import admin
from django.utils.html import format_html

from .models import Inquiry


@admin.action(description="Mark as contacted")
def mark_contacted(modeladmin, request, queryset):
    queryset.update(status=Inquiry.Status.CONTACTED)


@admin.action(description="Mark as quoted")
def mark_quoted(modeladmin, request, queryset):
    queryset.update(status=Inquiry.Status.QUOTED)


@admin.action(description="Mark as won")
def mark_won(modeladmin, request, queryset):
    queryset.update(status=Inquiry.Status.WON)


@admin.action(description="Mark as lost")
def mark_lost(modeladmin, request, queryset):
    queryset.update(status=Inquiry.Status.LOST)


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "customer",
        "inquiry_type_badge",
        "status_badge",
        "route_summary",
        "product",
        "created_at",
    )
    list_filter = ("inquiry_type", "status", "created_at")
    search_fields = ("name", "email", "company", "message", "origin", "destination")
    readonly_fields = ("id", "created_at", "updated_at")
    date_hierarchy = "created_at"
    list_per_page = 25
    actions = [mark_contacted, mark_quoted, mark_won, mark_lost]
    list_select_related = ("product", "customer")
    fieldsets = (
        (None, {"fields": ("id", "inquiry_type", "status", "customer")}),
        ("Contact", {"fields": ("name", "company", "email", "phone")}),
        ("Shipment", {"fields": ("origin", "destination", "product", "incoterms", "volume")}),
        ("Message", {"fields": ("message",)}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    @admin.display(description="Type", ordering="inquiry_type")
    def inquiry_type_badge(self, obj):
        colors = {
            Inquiry.InquiryType.CONTACT: "#2563EB",
            Inquiry.InquiryType.QUOTE: "#F59E0B",
        }
        color = colors.get(obj.inquiry_type, "#6B7280")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">{}</span>',
            color,
            obj.get_inquiry_type_display(),
        )

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        colors = {
            Inquiry.Status.NEW: "#0A2540",
            Inquiry.Status.CONTACTED: "#2563EB",
            Inquiry.Status.QUOTED: "#7C3AED",
            Inquiry.Status.WON: "#059669",
            Inquiry.Status.LOST: "#6B7280",
        }
        color = colors.get(obj.status, "#6B7280")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">{}</span>',
            color,
            obj.get_status_display(),
        )

    @admin.display(description="Route")
    def route_summary(self, obj):
        if obj.origin or obj.destination:
            return f"{obj.origin or '—'} → {obj.destination or '—'}"
        return "—"
