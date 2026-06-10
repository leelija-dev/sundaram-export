from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("inquiries", "0002_inquiry_customer"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="inquiry",
            name="service",
        ),
        migrations.RemoveField(
            model_name="inquiry",
            name="quote_category",
        ),
    ]
