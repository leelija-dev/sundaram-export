"""Professional export invoice numbers — year-scoped sequence + random suffix."""

import re
import secrets

from django.conf import settings
from django.utils import timezone

# Crockford-style alphabet (no 0/O, 1/I/L)
_SUFFIX_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
_SEQ_PATTERN = re.compile(r"^(.+-EXP-\d{4}-)(\d{6})-")


def invoice_number_prefix() -> str:
    explicit = getattr(settings, "INVOICE_NUMBER_PREFIX", "").strip()
    if explicit:
        return explicit.upper()
    initials = "".join(word[0].upper() for word in settings.COMPANY_NAME.split() if word)
    return (initials[:4] or "SE").upper()


def _year_stem(year: int | None = None) -> str:
    year = year or timezone.now().year
    return f"{invoice_number_prefix()}-EXP-{year}-"


def _parse_sequence(invoice_number: str, stem: str) -> int | None:
    if not invoice_number.startswith(stem):
        return None
    match = _SEQ_PATTERN.match(invoice_number)
    if not match or match.group(1) != stem:
        return None
    return int(match.group(2))


def _next_sequence(invoice_model, stem: str) -> int:
    max_seq = 0
    queryset = (
        invoice_model.objects.filter(invoice_number__startswith=stem)
        .select_for_update()
        .values_list("invoice_number", flat=True)
    )
    for number in queryset:
        seq = _parse_sequence(number, stem)
        if seq is not None:
            max_seq = max(max_seq, seq)
    return max_seq + 1


def _random_suffix(length: int = 4) -> str:
    return "".join(secrets.choice(_SUFFIX_ALPHABET) for _ in range(length))


def compose_invoice_number(invoice_model, year: int | None = None) -> str:
    """Build one candidate number; caller should save inside transaction.atomic()."""
    stem = _year_stem(year)
    seq = _next_sequence(invoice_model, stem)
    return f"{stem}{seq:06d}-{_random_suffix()}"
