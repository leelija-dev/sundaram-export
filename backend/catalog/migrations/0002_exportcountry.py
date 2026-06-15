import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ExportCountry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(max_length=120, unique=True)),
                ("name", models.CharField(help_text="e.g. Bangladesh, Dubai", max_length=200)),
                ("subtitle", models.CharField(blank=True, help_text="Optional context, e.g. UAE, South Asia", max_length=120)),
                ("description", models.TextField(blank=True)),
                ("key_ports", models.JSONField(blank=True, default=list)),
                ("specialties", models.JSONField(blank=True, default=list)),
                ("is_published", models.BooleanField(default=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "region",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="export_countries",
                        to="catalog.marketregion",
                    ),
                ),
            ],
            options={
                "verbose_name": "Export country",
                "verbose_name_plural": "Export countries",
                "ordering": ["sort_order", "name"],
            },
        ),
    ]
