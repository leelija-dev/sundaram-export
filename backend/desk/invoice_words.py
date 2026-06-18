"""Convert invoice totals to words for export invoices."""

from decimal import Decimal

_ONES = (
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
)
_TENS = ("", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
_SCALES = ("", "thousand", "million", "billion")

_CURRENCY_NAMES = {
    "INR": "rupees",
    "USD": "dollars",
    "EUR": "euro",
    "GBP": "pounds",
    "BDT": "taka",
    "AED": "dirhams",
}


def _under_thousand(n: int) -> str:
    parts = []
    if n >= 100:
        parts.append(f"{_ONES[n // 100]} hundred")
        n %= 100
    if n >= 20:
        tens = _TENS[n // 10]
        if n % 10:
            parts.append(f"{tens}-{_ONES[n % 10]}")
        else:
            parts.append(tens)
    elif n > 0:
        parts.append(_ONES[n])
    return " ".join(parts)


def _int_to_words(n: int) -> str:
    if n == 0:
        return _ONES[0]
    if n < 0:
        return f"minus {_int_to_words(-n)}"

    words = []
    scale_idx = 0
    while n > 0:
        chunk = n % 1000
        if chunk:
            chunk_words = _under_thousand(chunk)
            if _SCALES[scale_idx]:
                chunk_words = f"{chunk_words} {_SCALES[scale_idx]}"
            words.insert(0, chunk_words.strip())
        n //= 1000
        scale_idx += 1
    return " ".join(words)


def amount_in_words(amount, currency_code: str = "INR") -> str:
    """Return e.g. THIRTY-EIGHT EURO ONLY."""
    value = Decimal(str(amount or 0)).quantize(Decimal("0.01"))
    units = int(value)
    fraction = int((value - units) * 100)

    currency = (currency_code or "INR").upper()
    unit_name = _CURRENCY_NAMES.get(currency, currency.lower())

    if units and fraction:
        body = f"{_int_to_words(units)} and {fraction:02d}/100 {unit_name}"
    elif units:
        body = f"{_int_to_words(units)} {unit_name}"
    else:
        body = f"{fraction:02d}/100 {unit_name}"

    return f"{body} only".upper()
