from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("master", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE master_category "
                "ADD COLUMN IF NOT EXISTS created_at timestamp with time zone "
                "NOT NULL DEFAULT NOW();"
                "ALTER TABLE master_category "
                "ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone "
                "NOT NULL DEFAULT NOW();"
                "ALTER TABLE master_currency "
                "ADD COLUMN IF NOT EXISTS created_at timestamp with time zone "
                "NOT NULL DEFAULT NOW();"
                "ALTER TABLE master_currency "
                "ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone "
                "NOT NULL DEFAULT NOW();"
            ),
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
