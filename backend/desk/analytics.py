import json
from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone

from customers.models import Customer
from inquiries.models import Inquiry

PERIOD_OPTIONS = {
    "7d": ("Last 7 days", 7),
    "14d": ("Last 14 days", 14),
    "30d": ("Last 30 days", 30),
    "90d": ("Last 90 days", 90),
    "all": ("All time", None),
}


def _parse_filters(period=None, inquiry_type=None, status=None):
    period = period if period in PERIOD_OPTIONS else "14d"
    valid_types = {"", Inquiry.InquiryType.CONTACT, Inquiry.InquiryType.QUOTE}
    valid_statuses = {"", *dict(Inquiry.Status.choices).keys()}
    inquiry_type = inquiry_type if inquiry_type in valid_types else ""
    status = status if status in valid_statuses else ""
    return period, inquiry_type, status


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


def get_analytics_dashboard(period="14d", inquiry_type="", status=""):
    period, inquiry_type, status = _parse_filters(period, inquiry_type, status)
    period_label, period_days = PERIOD_OPTIONS[period]

    now = timezone.now()
    today = now.date()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    inquiry_qs = Inquiry.objects.all()
    if inquiry_type:
        inquiry_qs = inquiry_qs.filter(inquiry_type=inquiry_type)
    if status:
        inquiry_qs = inquiry_qs.filter(status=status)

    if period_days:
        period_start = today - timedelta(days=period_days - 1)
        period_qs = inquiry_qs.filter(created_at__date__gte=period_start)
    else:
        period_start = None
        period_qs = inquiry_qs

    by_status = dict(
        period_qs.values("status")
        .annotate(count=Count("id"))
        .values_list("status", "count")
    )
    for st, _label in Inquiry.Status.choices:
        by_status.setdefault(st, 0)

    inquiries_this_week = inquiry_qs.filter(created_at__gte=week_ago).count()
    inquiries_prev_week = inquiry_qs.filter(
        created_at__gte=two_weeks_ago, created_at__lt=week_ago
    ).count()
    week_delta = inquiries_this_week - inquiries_prev_week

    total_inquiries = period_qs.count()
    won = by_status.get(Inquiry.Status.WON, 0)
    win_rate = round(100 * won / total_inquiries, 1) if total_inquiries else 0
    active_pipeline = (
        by_status.get(Inquiry.Status.NEW, 0)
        + by_status.get(Inquiry.Status.CONTACTED, 0)
        + by_status.get(Inquiry.Status.QUOTED, 0)
    )

    if period_start:
        trend_start = period_start
    else:
        first = period_qs.order_by("created_at").values_list("created_at", flat=True).first()
        trend_start = first.date() if first else today

    daily_raw = (
        period_qs.filter(created_at__date__gte=trend_start)
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(count=Count("id"))
    )
    trend_labels, trend_counts = _fill_daily_series(trend_start, today, daily_raw)

    top_destinations = list(
        period_qs.exclude(destination="")
        .values("destination")
        .annotate(count=Count("id"))
        .order_by("-count")[:6]
    )

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
    }
    if top_destinations:
        charts["destination_labels"] = [d["destination"] for d in top_destinations]
        charts["destination_counts"] = [d["count"] for d in top_destinations]

    pipeline_total = sum(charts["pipeline_counts"])

    return {
        "generated_at": now.strftime("%d %b %Y, %H:%M"),
        "filters": {
            "period": period,
            "type": inquiry_type,
            "status": status,
            "period_label": period_label,
            "active_count": int(bool(inquiry_type or status or period != "14d")),
        },
        "inquiries": {
            "new": by_status.get(Inquiry.Status.NEW, 0),
            "last_7_days": inquiries_this_week,
            "week_delta": week_delta,
            "win_rate": win_rate,
            "active_pipeline": active_pipeline,
            "won": won,
            "pipeline_total": pipeline_total,
            "filtered_total": total_inquiries,
        },
        "customers": {
            "total": Customer.objects.count(),
            "active": Customer.objects.filter(status=Customer.Status.ACTIVE).count(),
        },
        "recent_inquiries": period_qs.select_related("product", "customer").order_by("-created_at")[:5],
        "has_destinations": bool(top_destinations),
        "has_trend_data": total_inquiries > 0,
        "has_pipeline_data": pipeline_total > 0,
        "charts_json": json.dumps(charts),
    }


def get_dashboard_stats(request=None):
    period = "14d"
    inquiry_type = ""
    status = ""
    if request is not None:
        period = request.GET.get("period", "14d")
        inquiry_type = request.GET.get("type", "")
        status = request.GET.get("status", "")
    return get_analytics_dashboard(period, inquiry_type, status)
