import uuid

from django.db import models

from catalog.models import Product


class Inquiry(models.Model):
    class InquiryType(models.TextChoices):
        CONTACT = "contact", "Contact"
        QUOTE = "quote", "Quote"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUOTED = "quoted", "Quoted"
        WON = "won", "Won"
        LOST = "lost", "Lost"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inquiries",
    )
    inquiry_type = models.CharField(max_length=16, choices=InquiryType.choices)
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=64, blank=True)
    origin = models.CharField(max_length=200, blank=True)
    destination = models.CharField(max_length=200, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiries"
    )
    incoterms = models.CharField(max_length=120, blank=True)
    volume = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Inquiries"

    def __str__(self):
        return f"{self.inquiry_type} — {self.name} ({self.email})"
