from collections import Counter
from datetime import date

from django.db.models import Count
from django.utils import timezone

from catalog.models import ExportCountry, MarketRegion, Office, Product
from inquiries.models import Inquiry

from .models import ExportReport


def _inquiry_qs(date_from: date | None, date_to: date | None):
    qs = Inquiry.objects.all()
    if date_from:
        qs = qs.filter(created_at__date__gte=date_from)
    if date_to:
        qs = qs.filter(created_at__date__lte=date_to)
    return qs


def generate_report_data(report_type: str, date_from=None, date_to=None) -> dict:
    inquiries = _inquiry_qs(date_from, date_to)

    if report_type == ExportReport.ReportType.INQUIRIES_SUMMARY:
        return {
            "total": inquiries.count(),
            "by_type": dict(inquiries.values("inquiry_type").annotate(c=Count("id")).values_list("inquiry_type", "c")),
            "by_status": dict(inquiries.values("status").annotate(c=Count("id")).values_list("status", "c")),
            "period": {"from": str(date_from) if date_from else None, "to": str(date_to) if date_to else None},
        }

    if report_type == ExportReport.ReportType.PIPELINE:
        by_status = dict(
            inquiries.values("status").annotate(c=Count("id")).values_list("status", "c")
        )
        won = by_status.get(Inquiry.Status.WON, 0)
        total = inquiries.count() or 1
        return {
            "pipeline": by_status,
            "win_rate_pct": round(100 * won / total, 1),
            "new_leads": by_status.get(Inquiry.Status.NEW, 0),
            "quoted": by_status.get(Inquiry.Status.QUOTED, 0),
            "period": {"from": str(date_from) if date_from else None, "to": str(date_to) if date_to else None},
        }

    if report_type == ExportReport.ReportType.CATALOG:
        return {
            "products": Product.objects.count(),
            "products_published": Product.objects.filter(is_published=True).count(),
            "markets": MarketRegion.objects.count(),
            "countries": ExportCountry.objects.count(),
            "countries_published": ExportCountry.objects.filter(is_published=True).count(),
            "offices": Office.objects.count(),
            "generated_at": timezone.now().isoformat(),
        }

    if report_type == ExportReport.ReportType.LEADS_BY_DESTINATION:
        destinations = []
        for i in inquiries.only("destination"):
            d = (i.destination or "").strip()
            destinations.append(d if d else "Unspecified")
        counts = Counter(destinations)
        return {
            "destinations": dict(counts.most_common(20)),
            "total_with_destination": sum(1 for i in inquiries if (i.destination or "").strip()),
            "period": {"from": str(date_from) if date_from else None, "to": str(date_to) if date_to else None},
        }

    return {"error": "Unknown report type"}
