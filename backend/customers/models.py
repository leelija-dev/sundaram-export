from django.db import models

from catalog.models import ExportCountry


class Customer(models.Model):
    class Status(models.TextChoices):
        PROSPECT = "prospect", "Prospect"
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    class CustomerType(models.TextChoices):
        IMPORTER = "importer", "Importer"
        DISTRIBUTOR = "distributor", "Distributor"
        RETAILER = "retailer", "Retailer"
        MANUFACTURER = "manufacturer", "Manufacturer"
        OTHER = "other", "Other"

    company_name = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=64, blank=True)
    export_country = models.ForeignKey(
        ExportCountry,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="customers",
        verbose_name="Primary export destination",
    )
    country_other = models.CharField(
        max_length=200,
        blank=True,
        help_text="If destination is not in export countries list",
    )
    address = models.TextField(blank=True)
    customer_type = models.CharField(
        max_length=32, choices=CustomerType.choices, default=CustomerType.IMPORTER
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PROSPECT)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["company_name"]

    def __str__(self):
        if self.contact_name:
            return f"{self.company_name} — {self.contact_name}"
        return self.company_name

    @property
    def destination_display(self):
        if self.export_country:
            return str(self.export_country)
        return self.country_other or "—"
