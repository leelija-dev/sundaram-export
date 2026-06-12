from decimal import Decimal

from django.conf import settings
from django.db import models
from django.db.models import Max

from inquiries.models import Inquiry
from master.models import Currency


class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        PAID = "paid", "Paid"
        CANCELLED = "cancelled", "Cancelled"

    invoice_number = models.CharField(max_length=32, unique=True, editable=False)
    inquiry = models.ForeignKey(
        Inquiry, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    client_name = models.CharField(max_length=200)
    client_company = models.CharField(max_length=200, blank=True)
    client_email = models.EmailField(blank=True)
    client_address = models.TextField(blank=True)
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
        from django.utils import timezone

        year = timezone.now().year
        prefix = f"INV-{year}-"
        last = (
            cls.objects.filter(invoice_number__startswith=prefix)
            .aggregate(Max("invoice_number"))
            .get("invoice_number__max")
        )
        if last:
            try:
                seq = int(last.split("-")[-1]) + 1
            except ValueError:
                seq = 1
        else:
            seq = 1
        return f"{prefix}{seq:04d}"


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
        INQUIRIES_SUMMARY = "inquiries_summary", "Inquiries summary"
        PIPELINE = "pipeline", "Sales pipeline"
        CATALOG = "catalog", "Catalog overview"
        LEADS_BY_DESTINATION = "leads_by_destination", "Leads by destination country"

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
