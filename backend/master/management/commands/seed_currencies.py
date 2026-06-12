from django.core.management.base import BaseCommand

from master.models import Currency


DEFAULT_CURRENCIES = [
    ("USD", "US Dollar", "$", 1),
    ("EUR", "Euro", "€", 2),
    ("GBP", "British Pound", "£", 3),
    ("INR", "Indian Rupee", "₹", 4),
    ("AED", "UAE Dirham", "د.إ", 5),
    ("SGD", "Singapore Dollar", "S$", 6),
    ("MYR", "Malaysian Ringgit", "RM", 7),
    ("CNY", "Chinese Yuan", "¥", 8),
    ("JPY", "Japanese Yen", "¥", 9),
    ("AUD", "Australian Dollar", "A$", 10),
    ("CAD", "Canadian Dollar", "C$", 11),
    ("CHF", "Swiss Franc", "Fr", 12),
    ("SAR", "Saudi Riyal", "﷼", 13),
    ("QAR", "Qatari Riyal", "﷼", 14),
    ("KRW", "South Korean Won", "₩", 15),
    ("THB", "Thai Baht", "฿", 16),
    ("VND", "Vietnamese Dong", "₫", 17),
    ("BRL", "Brazilian Real", "R$", 18),
    ("ZAR", "South African Rand", "R", 19),
    ("NGN", "Nigerian Naira", "₦", 20),
]


class Command(BaseCommand):
    help = "Seed master currency data"

    def handle(self, *args, **options):
        created_count = 0
        for code, name, symbol, sort_order in DEFAULT_CURRENCIES:
            _, created = Currency.objects.get_or_create(
                code=code,
                defaults={"name": name, "symbol": symbol, "sort_order": sort_order, "is_active": True},
            )
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} currencies. Total: {Currency.objects.count()}"))