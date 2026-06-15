from django import template

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
def format_report_value(value):
    if isinstance(value, dict):
        parts = [f"{k}: {v}" for k, v in value.items()]
        return "; ".join(parts)
    if isinstance(value, list):
        return ", ".join(str(v) for v in value)
    return value
