import json
from datetime import timedelta

from django.db import models
from django.db.models import Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from catalog.models import ExportCountry, MarketRegion, Office, Product
from customers.models import Customer
from documents.models import ExportReport, Invoice
from inquiries.models import Inquiry


def _fill_daily_series(start_date, end_date, daily_counts):
    by_day = {row["day"]: row["count"] for row in daily_counts if row["day"]}
    labels = []
    counts = []
    current = start_date
    while current <= end_date:
        labels.append(current.strftime("%d %b"))
        counts.append(by_day.get(current, 0))
        current += timedelta(days=1)
    return labels, counts


def get_analytics_dashboard():
    now = timezone.now()
    today = now.date()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)
    days_14_start = today - timedelta(days=13)

    inquiry_qs = Inquiry.objects.all()

    by_status = dict(
        inquiry_qs.values("status")
        .annotate(count=Count("id"))
        .values_list("status", "count")
    )
    for status, _label in Inquiry.Status.choices:
        by_status.setdefault(status, 0)

    inquiries_this_week = inquiry_qs.filter(created_at__gte=week_ago).count()
    inquiries_prev_week = inquiry_qs.filter(
        created_at__gte=two_weeks_ago, created_at__lt=week_ago
    ).count()
    week_delta = inquiries_this_week - inquiries_prev_week

    total_inquiries = inquiry_qs.count() or 1
    won = by_status.get(Inquiry.Status.WON, 0)
    win_rate = round(100 * won / total_inquiries, 1)
    active_pipeline = (
        by_status.get(Inquiry.Status.NEW, 0)
        + by_status.get(Inquiry.Status.CONTACTED, 0)
        + by_status.get(Inquiry.Status.QUOTED, 0)
    )

    daily_raw = (
        inquiry_qs.filter(created_at__date__gte=days_14_start)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
    )
    trend_labels, trend_counts = _fill_daily_series(days_14_start, today, daily_raw)

    top_destinations = list(
        inquiry_qs.exclude(destination="")
        .values("destination")
        .annotate(count=Count("id"))
        .order_by("-count")[:8]
    )

    top_products = list(
        inquiry_qs.filter(product__isnull=False)
        .values("product__title")
        .annotate(count=Count("id"))
        .order_by("-count")[:6]
    )

    invoices_by_status = dict(
        Invoice.objects.values("status")
        .annotate(count=Count("id"))
        .values_list("status", "count")
    )
    for s, _ in Invoice.Status.choices:
        invoices_by_status.setdefault(s, 0)

    invoice_agg = Invoice.objects.aggregate(
        paid_total=Sum("total", filter=models.Q(status=Invoice.Status.PAID)),
    )

    customers_by_status = dict(
        Customer.objects.values("status")
        .annotate(count=Count("id"))
        .values_list("status", "count")
    )
    for s, _ in Customer.Status.choices:
        customers_by_status.setdefault(s, 0)

    charts = {
        "trend_labels": trend_labels,
        "trend_counts": trend_counts,
        "pipeline_labels": ["New", "Contacted", "Quoted", "Won", "Lost"],
        "pipeline_counts": [
            by_status.get(Inquiry.Status.NEW, 0),
            by_status.get(Inquiry.Status.CONTACTED, 0),
            by_status.get(Inquiry.Status.QUOTED, 0),
            by_status.get(Inquiry.Status.WON, 0),
            by_status.get(Inquiry.Status.LOST, 0),
        ],
        "type_labels": ["Contact", "Quote"],
        "type_counts": [
            inquiry_qs.filter(inquiry_type=Inquiry.InquiryType.CONTACT).count(),
            inquiry_qs.filter(inquiry_type=Inquiry.InquiryType.QUOTE).count(),
        ],
        "destination_labels": [d["destination"][:28] for d in top_destinations] or ["No data"],
        "destination_counts": [d["count"] for d in top_destinations] or [0],
        "product_labels": [p["product__title"][:24] for p in top_products] or ["No data"],
        "product_counts": [p["count"] for p in top_products] or [0],
        "customer_labels": ["Prospect", "Active", "Inactive"],
        "customer_counts": [
            customers_by_status.get(Customer.Status.PROSPECT, 0),
            customers_by_status.get(Customer.Status.ACTIVE, 0),
            customers_by_status.get(Customer.Status.INACTIVE, 0),
        ],
        "invoice_labels": ["Draft", "Sent", "Paid", "Cancelled"],
        "invoice_counts": [
            invoices_by_status.get(Invoice.Status.DRAFT, 0),
            invoices_by_status.get(Invoice.Status.SENT, 0),
            invoices_by_status.get(Invoice.Status.PAID, 0),
            invoices_by_status.get(Invoice.Status.CANCELLED, 0),
        ],
    }

    return {
        "generated_at": now.strftime("%d %b %Y, %H:%M"),
        "catalog": {
            "products": Product.objects.count(),
            "products_published": Product.objects.filter(is_published=True).count(),
            "markets": MarketRegion.objects.count(),
            "countries": ExportCountry.objects.count(),
            "countries_published": ExportCountry.objects.filter(is_published=True).count(),
            "offices": Office.objects.count(),
        },
        "inquiries": {
            "total": inquiry_qs.count(),
            "new": by_status.get(Inquiry.Status.NEW, 0),
            "contacted": by_status.get(Inquiry.Status.CONTACTED, 0),
            "quoted": by_status.get(Inquiry.Status.QUOTED, 0),
            "won": won,
            "lost": by_status.get(Inquiry.Status.LOST, 0),
            "last_7_days": inquiries_this_week,
            "week_delta": week_delta,
            "contacts": inquiry_qs.filter(inquiry_type=Inquiry.InquiryType.CONTACT).count(),
            "quotes": inquiry_qs.filter(inquiry_type=Inquiry.InquiryType.QUOTE).count(),
            "by_status": by_status,
            "win_rate": win_rate,
            "active_pipeline": active_pipeline,
        },
        "customers": {
            "total": Customer.objects.count(),
            "active": customers_by_status.get(Customer.Status.ACTIVE, 0),
            "prospects": customers_by_status.get(Customer.Status.PROSPECT, 0),
            "inactive": customers_by_status.get(Customer.Status.INACTIVE, 0),
            "by_status": customers_by_status,
        },
        "documents": {
            "invoices": Invoice.objects.count(),
            "invoices_draft": invoices_by_status.get(Invoice.Status.DRAFT, 0),
            "invoices_paid": invoices_by_status.get(Invoice.Status.PAID, 0),
            "paid_total": invoice_agg.get("paid_total") or 0,
            "reports": ExportReport.objects.count(),
        },
        "recent_inquiries": inquiry_qs.select_related("product", "customer")[:6],
        "charts": charts,
        "charts_json": json.dumps(charts),
    }


def get_dashboard_stats():
    return get_analytics_dashboard()
