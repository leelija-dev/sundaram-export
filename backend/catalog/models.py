from django.db import models

from master.models import Category


class Product(models.Model):
    slug = models.SlugField(max_length=120, unique=True)
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Category",
    )
    hs_code = models.CharField(max_length=64, blank=True)
    origins = models.JSONField(default=list, blank=True)
    markets = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=list, blank=True)
    packaging = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self):
        return self.title


class MarketRegion(models.Model):
    slug = models.SlugField(max_length=120, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    countries = models.JSONField(default=list, blank=True)
    key_ports = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name_plural = "Market regions"

    def __str__(self):
        return self.name


class ExportCountry(models.Model):
    """Individual export destinations managed by admin (e.g. Bangladesh, Dubai)."""

    region = models.ForeignKey(
        MarketRegion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="export_countries",
    )
    slug = models.SlugField(max_length=120, unique=True)
    name = models.CharField(max_length=200, help_text="e.g. Bangladesh, Dubai")
    subtitle = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional context, e.g. UAE, South Asia",
    )
    description = models.TextField(blank=True)
    key_ports = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Export country"
        verbose_name_plural = "Export countries"

    def __str__(self):
        if self.subtitle:
            return f"{self.name} ({self.subtitle})"
        return self.name

    @property
    def display_name(self):
        return str(self)


class Office(models.Model):
    region = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=64)
    email = models.EmailField()
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "region"]

    def __str__(self):
        return self.region