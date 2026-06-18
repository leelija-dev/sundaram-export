"""Generate structured export-business reports (schema v2)."""

from __future__ import annotations

from collections import Counter
from decimal import Decimal

from django.conf import settings
from django.db.models import Count, Sum
from django.utils import timezone

from catalog.models import ExportCountry, MarketRegion, Office, Product
from customers.models import Customer
from documents.models import ExportReport, Invoice
from inquiries.models import Inquiry


def _period_label(date_from, date_to) -> str:
    if date_from and date_to:
        return f"{date_from:%d %b %Y} – {date_to:%d %b %Y}"
    if date_from:
        return f"From {date_from:%d %b %Y}"
    if date_to:
        return f"Up to {date_to:%d %b %Y}"
    return "All time"


def _envelope(summary: str, kpis: list, sections: list, *, date_from=None, date_to=None) -> dict:
    return {
        "schema_version": 2,
        "company": settings.COMPANY_NAME,
        "generated_at": timezone.now().isoformat(),
        "period": {
            "from": date_from.isoformat() if date_from else None,
            "to": date_to.isoformat() if date_to else None,
            "label": _period_label(date_from, date_to),
        },
        "summary": summary,
        "kpis": kpis,
        "sections": sections,
    }


def _pct(part: int, whole: int) -> str:
    if not whole:
        return "0%"
    return f"{round(100 * part / whole, 1)}%"


def _inquiry_qs(date_from, date_to):
    qs = Inquiry.objects.all()
    if date_from:
        qs = qs.filter(created_at__date__gte=date_from)
    if date_to:
        qs = qs.filter(created_at__date__lte=date_to)
    return qs


def _invoice_qs(date_from, date_to):
    qs = Invoice.objects.exclude(status=Invoice.Status.CANCELLED)
    if date_from:
        qs = qs.filter(issue_date__gte=date_from)
    if date_to:
        qs = qs.filter(issue_date__lte=date_to)
    return qs


def _customer_qs(date_from, date_to):
    qs = Customer.objects.select_related("export_country")
    if date_from:
        qs = qs.filter(created_at__date__gte=date_from)
    if date_to:
        qs = qs.filter(created_at__date__lte=date_to)
    return qs


def _status_table(qs, field: str, choices: list[tuple[str, str]], total: int) -> dict:
    counts = dict(qs.values(field).annotate(c=Count("id")).values_list(field, "c"))
    rows = []
    for key, label in choices:
        count = counts.get(key, 0)
        rows.append([label, str(count), _pct(count, total)])
    return {
        "title": "Breakdown",
        "type": "table",
        "headers": ["Category", "Count", "Share"],
        "rows": rows,
    }


def _export_sales_report(date_from, date_to) -> dict:
    invoices = _invoice_qs(date_from, date_to)
    total_count = invoices.count()
    agg = invoices.aggregate(subtotal_sum=Sum("subtotal"), total_sum=Sum("total"))
    total_value = agg["total_sum"] or Decimal("0")
    paid = invoices.filter(status=Invoice.Status.PAID).count()
    sent = invoices.filter(status=Invoice.Status.SENT).count()
    draft = invoices.filter(status=Invoice.Status.DRAFT).count()

    currency_rows = []
    for row in (
        invoices.values("currency__code", "currency__symbol")
        .annotate(count=Count("id"), amount=Sum("total"))
        .order_by("-amount")
    ):
        code = row["currency__code"] or "—"
        symbol = row["currency__symbol"] or code
        amount = row["amount"] or Decimal("0")
        currency_rows.append(
            [code, str(row["count"]), f"{symbol} {amount:,.2f}"]
        )

    buyer_totals: Counter[str] = Counter()
    for row in invoices.values("client_company", "client_name", "total"):
        buyer = (row["client_company"] or row["client_name"] or "Unnamed buyer").strip()
        buyer_totals[buyer] += row["total"] or Decimal("0")

    top_buyer_rows = [
        [name, f"{amount:,.2f}"]
        for name, amount in buyer_totals.most_common(10)
    ]

    sections = [
        _status_table(
            invoices,
            "status",
            Invoice.Status.choices,
            total_count,
        ),
    ]
    if currency_rows:
        sections.append(
            {
                "title": "Revenue by currency",
                "type": "table",
                "headers": ["Currency", "Invoices", "Total value"],
                "rows": currency_rows,
            }
        )
    if top_buyer_rows:
        sections.append(
            {
                "title": "Top buyers by invoice value",
                "type": "table",
                "headers": ["Buyer", "Invoice total"],
                "rows": top_buyer_rows,
            }
        )

    return _envelope(
        f"{total_count} export invoice{'s' if total_count != 1 else ''} in period; "
        f"combined value {total_value:,.2f} (excl. cancelled).",
        [
            {"label": "Invoices issued", "value": str(total_count), "note": "Cancelled excluded"},
            {"label": "Total invoice value", "value": f"{total_value:,.2f}", "note": "All currencies"},
            {"label": "Paid", "value": str(paid), "note": "Settled invoices"},
            {"label": "Outstanding", "value": str(sent + draft), "note": f"{sent} sent · {draft} draft"},
        ],
        sections,
        date_from=date_from,
        date_to=date_to,
    )


def _inquiries_summary_report(date_from, date_to) -> dict:
    inquiries = _inquiry_qs(date_from, date_to)
    total = inquiries.count()
    quote_count = inquiries.filter(inquiry_type=Inquiry.InquiryType.QUOTE).count()
    contact_count = inquiries.filter(inquiry_type=Inquiry.InquiryType.CONTACT).count()

    sections = [
        _status_table(inquiries, "status", Inquiry.Status.choices, total),
        _status_table(inquiries, "inquiry_type", Inquiry.InquiryType.choices, total),
    ]

    return _envelope(
        f"{total} inbound lead{'s' if total != 1 else ''} from website inquiries in the selected period.",
        [
            {"label": "Total inquiries", "value": str(total), "note": "Contact + quote requests"},
            {"label": "Quote requests", "value": str(quote_count), "note": _pct(quote_count, total)},
            {"label": "Contact messages", "value": str(contact_count), "note": _pct(contact_count, total)},
            {
                "label": "New leads",
                "value": str(inquiries.filter(status=Inquiry.Status.NEW).count()),
                "note": "Awaiting first response",
            },
        ],
        sections,
        date_from=date_from,
        date_to=date_to,
    )


def _pipeline_report(date_from, date_to) -> dict:
    inquiries = _inquiry_qs(date_from, date_to)
    total = inquiries.count() or 1
    by_status = dict(
        inquiries.values("status").annotate(c=Count("id")).values_list("status", "c")
    )
    won = by_status.get(Inquiry.Status.WON, 0)
    lost = by_status.get(Inquiry.Status.LOST, 0)
    active = sum(
        by_status.get(st, 0)
        for st in (Inquiry.Status.NEW, Inquiry.Status.CONTACTED, Inquiry.Status.QUOTED)
    )

    funnel_rows = []
    for key, label in Inquiry.Status.choices:
        count = by_status.get(key, 0)
        funnel_rows.append([label, str(count), _pct(count, total if total else 1)])

    return _envelope(
        f"Pipeline health: {active} active lead{'s' if active != 1 else ''}, "
        f"{won} won, win rate {round(100 * won / total, 1)}%.",
        [
            {"label": "Active pipeline", "value": str(active), "note": "New, contacted, quoted"},
            {"label": "Won deals", "value": str(won), "note": "Converted to export sale"},
            {"label": "Lost", "value": str(lost), "note": _pct(lost, total)},
            {"label": "Win rate", "value": f"{round(100 * won / total, 1)}%", "note": "Won ÷ all inquiries"},
        ],
        [
            {
                "title": "Sales funnel",
                "type": "table",
                "headers": ["Stage", "Count", "Share"],
                "rows": funnel_rows,
            }
        ],
        date_from=date_from,
        date_to=date_to,
    )


def _leads_by_destination_report(date_from, date_to) -> dict:
    inquiries = _inquiry_qs(date_from, date_to)
    total = inquiries.count()
    destinations: Counter[str] = Counter()
    for destination in inquiries.values_list("destination", flat=True):
        label = (destination or "").strip() or "Unspecified"
        destinations[label] += 1

    rows = [
        [country, str(count), _pct(count, total)]
        for country, count in destinations.most_common(20)
    ]
    specified = sum(
        1 for d in inquiries.values_list("destination", flat=True) if (d or "").strip()
    )

    return _envelope(
        f"Export interest from {len(destinations)} market{'s' if len(destinations) != 1 else ''}; "
        f"top destination: {destinations.most_common(1)[0][0] if destinations else '—'}.",
        [
            {"label": "Total inquiries", "value": str(total), "note": "In selected period"},
            {"label": "Markets listed", "value": str(len(destinations)), "note": "Unique destinations"},
            {"label": "With destination", "value": str(specified), "note": _pct(specified, total)},
            {
                "label": "Top market",
                "value": destinations.most_common(1)[0][0] if destinations else "—",
                "note": (
                    f"{destinations.most_common(1)[0][1]} leads"
                    if destinations
                    else "No data"
                ),
            },
        ],
        [
            {
                "title": "Leads by export destination",
                "type": "table",
                "headers": ["Destination", "Leads", "Share"],
                "rows": rows,
            }
        ],
        date_from=date_from,
        date_to=date_to,
    )


def _customer_summary_report(date_from, date_to) -> dict:
    customers = _customer_qs(date_from, date_to)
    total = customers.count()
    all_customers = Customer.objects.count()
    active = customers.filter(status=Customer.Status.ACTIVE).count()

    country_rows = []
    country_counts: Counter[str] = Counter()
    for customer in customers:
        if customer.export_country_id:
            label = customer.export_country.name
        elif customer.country_other:
            label = customer.country_other
        else:
            label = "Unspecified"
        country_counts[label] += 1
    for country, count in country_counts.most_common(15):
        country_rows.append([country, str(count), _pct(count, total)])

    sections = [_status_table(customers, "status", Customer.Status.choices, total)]
    if country_rows:
        sections.append(
            {
                "title": "Buyers by export destination",
                "type": "table",
                "headers": ["Destination", "Customers", "Share"],
                "rows": country_rows,
            }
        )

    return _envelope(
        f"{total} buyer record{'s' if total != 1 else ''} added in period "
        f"({all_customers} total on file).",
        [
            {"label": "New in period", "value": str(total), "note": "Customers created"},
            {"label": "Total customers", "value": str(all_customers), "note": "All time"},
            {"label": "Active buyers", "value": str(active), "note": "In period cohort"},
            {
                "label": "Prospects",
                "value": str(customers.filter(status=Customer.Status.PROSPECT).count()),
                "note": "In period cohort",
            },
        ],
        sections,
        date_from=date_from,
        date_to=date_to,
    )


def _catalog_report(date_from, date_to) -> dict:
    products = Product.objects.count()
    published = Product.objects.filter(is_published=True).count()
    markets = MarketRegion.objects.count()
    countries = ExportCountry.objects.count()
    countries_live = ExportCountry.objects.filter(is_published=True).count()
    offices = Office.objects.filter(is_published=True).count()

    return _envelope(
        f"Catalog ready for export marketing: {published} live products across "
        f"{countries_live} destination countries.",
        [
            {"label": "Products", "value": str(products), "note": f"{published} published"},
            {"label": "Export countries", "value": str(countries), "note": f"{countries_live} on website"},
            {"label": "Market regions", "value": str(markets), "note": "Regional groupings"},
            {"label": "Offices", "value": str(offices), "note": "Published locations"},
        ],
        [
            {
                "title": "Website catalog snapshot",
                "type": "key_value",
                "items": [
                    {"label": "Total products", "value": str(products)},
                    {"label": "Published products", "value": str(published)},
                    {"label": "Export countries (total)", "value": str(countries)},
                    {"label": "Export countries (live)", "value": str(countries_live)},
                    {"label": "Market regions", "value": str(markets)},
                    {"label": "Published offices", "value": str(offices)},
                ],
            }
        ],
        date_from=date_from,
        date_to=date_to,
    )


_REPORT_BUILDERS = {
    ExportReport.ReportType.EXPORT_SALES: _export_sales_report,
    ExportReport.ReportType.INQUIRIES_SUMMARY: _inquiries_summary_report,
    ExportReport.ReportType.PIPELINE: _pipeline_report,
    ExportReport.ReportType.LEADS_BY_DESTINATION: _leads_by_destination_report,
    ExportReport.ReportType.CUSTOMER_SUMMARY: _customer_summary_report,
    ExportReport.ReportType.CATALOG: _catalog_report,
}


REPORT_TYPE_HELP = {
    ExportReport.ReportType.EXPORT_SALES: (
        "Invoice volume, revenue by currency, buyer rankings, and payment status."
    ),
    ExportReport.ReportType.INQUIRIES_SUMMARY: (
        "Inbound leads from the website — contact forms and quote requests."
    ),
    ExportReport.ReportType.PIPELINE: (
        "Sales funnel stages, win rate, and active export opportunities."
    ),
    ExportReport.ReportType.LEADS_BY_DESTINATION: (
        "Which export markets (Bangladesh, Nepal, etc.) inquiries come from."
    ),
    ExportReport.ReportType.CUSTOMER_SUMMARY: (
        "Buyer accounts created, status mix, and destination countries."
    ),
    ExportReport.ReportType.CATALOG: (
        "Products, export countries, and markets published on the website."
    ),
}


def generate_report_data(report_type: str, date_from=None, date_to=None) -> dict:
    builder = _REPORT_BUILDERS.get(report_type)
    if not builder:
        return _envelope(
            "Unknown report type.",
            [],
            [{"title": "Error", "type": "key_value", "items": [{"label": "Message", "value": "Unsupported report type"}]}],
            date_from=date_from,
            date_to=date_to,
        )
    return builder(date_from, date_to)
