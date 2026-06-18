from decimal import Decimal

from django.conf import settings
from django.db import models, transaction
from django.db.utils import IntegrityError

from inquiries.models import Inquiry
from master.models import Currency


class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        PAID = "paid", "Paid"
        CANCELLED = "cancelled", "Cancelled"

    invoice_number = models.CharField(max_length=40, unique=True, editable=False)
    inquiry = models.ForeignKey(
        Inquiry, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    client_name = models.CharField(max_length=200)
    client_company = models.CharField(max_length=200, blank=True)
    client_email = models.EmailField(blank=True)
    client_phone = models.CharField(max_length=64, blank=True)
    client_address = models.TextField(blank=True)
    client_gstin = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Buyer tax ID (optional)",
        help_text="Leave blank for export invoices to foreign buyers. Fill only for Indian GSTIN or a foreign VAT/TIN.",
    )
    issue_date = models.DateField()
    due_date = models.DateField(null=True, blank=True)
    currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name="Currency",
        help_text="Select a currency from the master list",
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    notes = models.TextField(blank=True)
    # Export shipping (shown on commercial invoice — editable per invoice)
    pre_carriage_by = models.CharField(max_length=120, blank=True)
    place_of_pre_carriage = models.CharField(max_length=200, blank=True)
    port_of_loading = models.CharField(max_length=200, blank=True)
    vessel_flight_no = models.CharField(max_length=120, blank=True)
    port_of_discharge = models.CharField(max_length=200, blank=True)
    final_destination = models.CharField(max_length=200, blank=True)
    country_of_origin = models.CharField(max_length=120, blank=True)
    country_of_final_destination = models.CharField(max_length=120, blank=True)
    volume_shipment = models.CharField(max_length=200, blank=True)
    incoterms = models.CharField(max_length=120, blank=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0"))
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    total = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invoices_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date", "-created_at"]

    def __str__(self):
        return self.invoice_number

    def recalculate_totals(self):
        lines = self.lines.all()
        self.subtotal = sum((line.amount for line in lines), Decimal("0"))
        self.tax_amount = (self.subtotal * self.tax_rate / Decimal("100")).quantize(Decimal("0.01"))
        self.total = self.subtotal + self.tax_amount

    @classmethod
    def generate_number(cls):
        from .invoice_numbers import compose_invoice_number

        for _ in range(12):
            try:
                with transaction.atomic():
                    candidate = compose_invoice_number(cls)
                    if not cls.objects.filter(invoice_number=candidate).exists():
                        return candidate
            except IntegrityError:
                continue
        raise RuntimeError("Unable to generate a unique invoice number. Please try again.")


class InvoiceLine(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="lines")
    description = models.CharField(max_length=300)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("1"))
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0"))
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]

    @property
    def amount(self):
        return (self.quantity * self.unit_price).quantize(Decimal("0.01"))

    def __str__(self):
        return self.description


class ExportReport(models.Model):
    class ReportType(models.TextChoices):
        EXPORT_SALES = "export_sales", "Export sales & invoices"
        INQUIRIES_SUMMARY = "inquiries_summary", "Inquiry & lead summary"
        PIPELINE = "pipeline", "Sales pipeline & conversion"
        LEADS_BY_DESTINATION = "leads_by_destination", "Leads by export market"
        CUSTOMER_SUMMARY = "customer_summary", "Customers & buyers"
        CATALOG = "catalog", "Catalog & markets overview"

    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=32, choices=ReportType.choices)
    date_from = models.DateField(null=True, blank=True)
    date_to = models.DateField(null=True, blank=True)
    data = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports_generated",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
