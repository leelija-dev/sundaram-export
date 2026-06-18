from django import template

from desk.invoice_words import amount_in_words

register = template.Library()


@register.filter
def money_symbol(obj):
    """Return currency symbol from an Invoice or Currency instance."""
    currency = getattr(obj, "currency", obj)
    if currency and getattr(currency, "symbol", None):
        return currency.symbol
    if currency and getattr(currency, "code", None):
        return currency.code
    return "—"


@register.filter
def invoice_amount_words(invoice):
    code = invoice.currency.code if invoice.currency else "INR"
    return amount_in_words(invoice.total, code)


@register.filter
def sum_line_qty(lines):
    total = sum((line.quantity for line in lines), 0)
    return f"{total:.2f}"


@register.filter
def format_report_value(value):
    if isinstance(value, dict):
        parts = [f"{k}: {v}" for k, v in value.items()]
        return "; ".join(parts)
    if isinstance(value, list):
        return ", ".join(str(v) for v in value)
    return value
