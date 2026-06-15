from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0002_exportcountry"),
        ("inquiries", "0003_remove_inquiry_service_quote_category"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Service",
        ),
    ]
