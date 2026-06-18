from django.db import migrations, models


def seed_industries(apps, schema_editor):
    Industry = apps.get_model("catalog", "Industry")
    rows = [
        {
            "slug": "agriculture-agro-processing",
            "name": "Agriculture & agro-processing",
            "description": "Farm-to-port traceability for spices, grains, and oleoresins.",
            "compliance_tag": "APEDA · traceability",
            "sort_order": 1,
        },
        {
            "slug": "textiles-apparel",
            "name": "Textiles & apparel",
            "description": "Mill partnerships with compliance labeling for global retail.",
            "compliance_tag": "Retail compliance",
            "sort_order": 2,
        },
        {
            "slug": "automotive-engineering",
            "name": "Automotive & engineering",
            "description": "OEM-grade components with PPAP and quality documentation.",
            "compliance_tag": "PPAP · OEM grade",
            "sort_order": 3,
        },
        {
            "slug": "chemicals-pharmaceuticals",
            "name": "Chemicals & pharmaceuticals",
            "description": "REACH, SDS, and DG logistics for regulated shipments.",
            "compliance_tag": "REACH · DG cargo",
            "sort_order": 4,
        },
        {
            "slug": "food-seafood",
            "name": "Food & seafood",
            "description": "Cold-chain exports with health certificates and HACCP audits.",
            "compliance_tag": "HACCP · cold chain",
            "sort_order": 5,
        },
        {
            "slug": "retail-ecommerce",
            "name": "Retail & e-commerce",
            "description": "Consolidated LCL and fulfillment for SKU-heavy catalogs.",
            "compliance_tag": "LCL · fulfillment",
            "sort_order": 6,
        },
    ]
    for row in rows:
        Industry.objects.update_or_create(slug=row["slug"], defaults=row)


def unseed_industries(apps, schema_editor):
    Industry = apps.get_model("catalog", "Industry")
    Industry.objects.filter(
        slug__in=[
            "agriculture-agro-processing",
            "textiles-apparel",
            "automotive-engineering",
            "chemicals-pharmaceuticals",
            "food-seafood",
            "retail-ecommerce",
        ]
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0002_product_image"),
    ]

    operations = [
        migrations.CreateModel(
            name="Industry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(max_length=120, unique=True)),
                ("name", models.CharField(max_length=200)),
                ("description", models.TextField()),
                (
                    "compliance_tag",
                    models.CharField(
                        blank=True,
                        help_text="Short compliance label, e.g. APEDA · traceability",
                        max_length=120,
                    ),
                ),
                ("is_published", models.BooleanField(default=True)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name_plural": "industries",
                "ordering": ["sort_order", "name"],
            },
        ),
        migrations.RunPython(seed_industries, unseed_industries),
    ]
