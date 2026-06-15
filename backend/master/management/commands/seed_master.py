from django.core.management.base import BaseCommand

from master.models import Category, Currency


DEFAULT_CATEGORIES = [
    ("spices", "Spices & seasonings", "Whole and ground spices for export"),
    ("grains", "Grains & pulses", "Rice, wheat, lentils, and legumes"),
    ("agro", "Agro commodities", "Fresh and processed agricultural products"),
    ("textiles", "Textiles", "Fabrics and textile goods"),
]

DEFAULT_CURRENCIES = [
    ("USD", "US Dollar", "$", 1),
    ("EUR", "Euro", "€", 2),
    ("INR", "Indian Rupee", "₹", 3),
    ("AED", "UAE Dirham", "د.إ", 4),
    ("GBP", "British Pound", "£", 5),
]


class Command(BaseCommand):
    help = "Seed default product categories and invoice currencies."

    def handle(self, *args, **options):
        for slug, name, description in DEFAULT_CATEGORIES:
            _, created = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "description": description,
                    "is_active": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Category: {name}"))

        for code, name, symbol, sort_order in DEFAULT_CURRENCIES:
            _, created = Currency.objects.get_or_create(
                code=code,
                defaults={
                    "name": name,
                    "symbol": symbol,
                    "sort_order": sort_order,
                    "is_active": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Currency: {code}"))

        self.stdout.write(self.style.SUCCESS("Seed complete."))
