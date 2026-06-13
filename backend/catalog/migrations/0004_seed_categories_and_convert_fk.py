from django.db import migrations, models
import django.db.models.deletion

# The original Product.Category choices mapped to slugs
CATEGORY_MAP = {
    "agriculture": "Agriculture",
    "textiles": "Textiles",
    "engineering": "Engineering",
    "chemicals": "Chemicals",
    "food-beverage": "Food & beverage",
    "handicrafts": "Handicrafts",
}


def seed_categories(apps, schema_editor):
    Category = apps.get_model("master", "Category")
    for slug, name in CATEGORY_MAP.items():
        Category.objects.get_or_create(
            slug=slug,
            defaults={"name": name, "sort_order": list(CATEGORY_MAP.keys()).index(slug)},
        )


def migrate_category_data(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    Category = apps.get_model("master", "Category")
    for product in Product.objects.all():
        slug = product.category  # old char field value
        if slug:
            cat = Category.objects.filter(slug=slug).first()
            if cat:
                product.category_new = cat
                product.save(update_fields=["category_new"])


def reverse_migrate_data(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    for product in Product.objects.all():
        if product.category_new:
            product.category = product.category_new.slug
            product.save(update_fields=["category"])


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0003_delete_service"),
        ("master", "0003_category"),
    ]

    operations = [
        # Step 1: Seed Category master table with existing categories
        migrations.RunPython(seed_categories, reverse_code=migrations.RunPython.noop),
        # Step 2: Add a temporary FK field
        migrations.AddField(
            model_name="product",
            name="category_new",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="master.category",
                verbose_name="Category",
            ),
        ),
        # Step 3: Migrate data from old char field to new FK
        migrations.RunPython(migrate_category_data, reverse_migrate_data),
        # Step 4: Remove old char field
        migrations.RemoveField(
            model_name="product",
            name="category",
        ),
        # Step 5: Rename new FK field to 'category'
        migrations.RenameField(
            model_name="product",
            old_name="category_new",
            new_name="category",
        ),
        # Step 6: Make the FK non-nullable (assumes all products now have a category)
        migrations.AlterField(
            model_name="product",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="master.category",
                verbose_name="Category",
            ),
        ),
    ]