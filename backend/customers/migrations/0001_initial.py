import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("catalog", "0002_exportcountry"),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("company_name", models.CharField(max_length=200)),
                ("contact_name", models.CharField(blank=True, max_length=200)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=64)),
                ("country_other", models.CharField(blank=True, help_text="If destination is not in export countries list", max_length=200)),
                ("address", models.TextField(blank=True)),
                ("customer_type", models.CharField(choices=[("importer", "Importer"), ("distributor", "Distributor"), ("retailer", "Retailer"), ("manufacturer", "Manufacturer"), ("other", "Other")], default="importer", max_length=32)),
                ("status", models.CharField(choices=[("prospect", "Prospect"), ("active", "Active"), ("inactive", "Inactive")], default="prospect", max_length=16)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "export_country",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="customers",
                        to="catalog.exportcountry",
                        verbose_name="Primary export destination",
                    ),
                ),
            ],
            options={
                "ordering": ["company_name"],
            },
        ),
    ]
