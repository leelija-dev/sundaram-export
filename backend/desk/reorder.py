"""Drag-and-drop reorder support for desk catalog lists."""

from django.db import transaction

from catalog.models import ExportCountry, Industry, MarketRegion, Product

REORDER_MODELS = {
    "products": Product,
    "countries": ExportCountry,
    "industries": Industry,
    "regions": MarketRegion,
}


def apply_sort_order(model, ordered_ids: list) -> None:
    """Set sort_order from 0..n for the given primary keys (in order)."""
    with transaction.atomic():
        for index, pk in enumerate(ordered_ids):
            model.objects.filter(pk=pk).update(sort_order=index)


def next_sort_order(model) -> int:
    from django.db.models import Max

    current = model.objects.aggregate(m=Max("sort_order"))["m"]
    return (current or 0) + 1
