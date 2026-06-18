from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0003_gstin_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="invoice",
            name="client_phone",
            field=models.CharField(blank=True, max_length=64),
        ),
    ]
