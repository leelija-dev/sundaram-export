from django.db import models


class Currency(models.Model):
    code = models.CharField(max_length=8, unique=True, verbose_name="Currency code")
    name = models.CharField(max_length=64, verbose_name="Currency name")
    symbol = models.CharField(max_length=8, blank=True, verbose_name="Symbol")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "code"]
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"

    def __str__(self):
        return f"{self.code} — {self.name}"


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True, verbose_name="Category name")
    slug = models.SlugField(max_length=64, unique=True)
    description = models.TextField(blank=True, verbose_name="Description")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name