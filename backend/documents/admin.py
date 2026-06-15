from django.contrib import admin

from .models import ExportReport, Invoice, InvoiceLine


class InvoiceLineInline(admin.TabularInline):
    model = InvoiceLine
    extra = 1


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "client_name", "issue_date", "total", "status")
    list_filter = ("status", "issue_date")
    search_fields = ("invoice_number", "client_name", "client_company")
    inlines = [InvoiceLineInline]
    readonly_fields = ("invoice_number", "subtotal", "tax_amount", "total")


@admin.register(ExportReport)
class ExportReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_type", "date_from", "date_to", "created_at")
    list_filter = ("report_type",)
