from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0004_invoice_client_phone"),
    ]

    operations = [
        migrations.AlterField(
            model_name="invoice",
            name="invoice_number",
            field=models.CharField(editable=False, max_length=40, unique=True),
        ),
    ]
