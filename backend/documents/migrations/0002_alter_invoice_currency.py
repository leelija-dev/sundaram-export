from django.db import migrations, models
import django.db.models.deletion


def create_currencies_from_existing(apps, schema_editor):
    """Create Currency objects from any existing distinct currency values in Invoice."""
    Currency = apps.get_model("master", "Currency")
    Invoice = apps.get_model("documents", "Invoice")

    existing_values = (
        Invoice.objects.exclude(currency__isnull=True)
        .exclude(currency="")
        .values_list("currency", flat=True)
        .distinct()
    )

    for code in existing_values:
        if code and not Currency.objects.filter(code=code).exists():
            Currency.objects.create(code=code, name=code, symbol=code, is_active=True)


def link_invoices(apps, schema_editor):
    """Link existing invoices to the newly created Currency objects."""
    Currency = apps.get_model("master", "Currency")
    Invoice = apps.get_model("documents", "Invoice")

    for invoice in Invoice.objects.exclude(currency__isnull=True).exclude(currency=""):
        curr = Currency.objects.filter(code=invoice.currency).first()
        if curr:
            Invoice.objects.filter(pk=invoice.pk).update(currency_new=curr.pk)


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0001_initial"),
        ("master", "0002_alter_currency_code"),
    ]

    operations = [
        # Step 1: add FK field as nullable with temporary name
        migrations.AddField(
            model_name="invoice",
            name="currency_new",
            field=models.ForeignKey(
                blank=True,
                help_text="Select a currency from the master list",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="master.currency",
                verbose_name="Currency",
            ),
        ),
        # Step 2: create Currency records for existing values
        migrations.RunPython(create_currencies_from_existing, migrations.RunPython.noop),
        # Step 3: link existing invoices to the currency FK
        migrations.RunPython(link_invoices, migrations.RunPython.noop),
        # Step 4: remove the old char field
        migrations.RemoveField(
            model_name="invoice",
            name="currency",
        ),
        # Step 5: rename new field to 'currency'
        migrations.RenameField(
            model_name="invoice",
            old_name="currency_new",
            new_name="currency",
        ),
    ]