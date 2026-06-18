"""Suggest and resolve export shipping details for invoices."""

from catalog.models import ExportCountry

_PLACEHOLDER_VALUES = frozenset({"a", "b", "c", "x", "y", "z", "test", "n/a", "na", "-", "—", "none", "tbd"})

INVOICE_SHIPPING_FIELDS = (
    "pre_carriage_by",
    "place_of_pre_carriage",
    "port_of_loading",
    "vessel_flight_no",
    "port_of_discharge",
    "final_destination",
    "country_of_origin",
    "country_of_final_destination",
    "volume_shipment",
    "incoterms",
)


def _clean(value: str) -> str:
    return (value or "").strip()


def _is_placeholder(value: str) -> bool:
    text = _clean(value)
    if not text:
        return True
    if text.lower() in _PLACEHOLDER_VALUES:
        return True
    if len(text) <= 2 and text.replace(".", "").isalpha():
        return True
    return False


def _ports_display(export_country) -> str:
    ports = getattr(export_country, "key_ports", None) or []
    if ports:
        return " / ".join(str(p) for p in ports[:2])
    return ""


def suggest_invoice_shipping(inquiry=None, exporter_office=None, customer=None) -> dict:
    """Build default shipping values when creating or editing an invoice."""
    if inquiry and inquiry.customer_id and not customer:
        customer = inquiry.customer

    export_country = customer.export_country if customer and customer.export_country_id else None

    place_pre_carriage = "Kolkata, West Bengal, India"
    if exporter_office and _clean(exporter_office.region):
        place_pre_carriage = f"{exporter_office.region}, India"

    port_loading = "Kolkata / Haldia"
    country_origin = "India"

    if inquiry and not _is_placeholder(inquiry.origin):
        origin = _clean(inquiry.origin)
        place_pre_carriage = origin
        if origin.lower() in {"india", "west bengal", "kolkata"}:
            country_origin = "India"
        elif len(origin.split()) <= 4:
            country_origin = origin

    destination_country = ""
    destination_port = ""
    if export_country:
        destination_country = export_country.name
        destination_port = _ports_display(export_country)
    elif customer and not _is_placeholder(customer.country_other):
        destination_country = _clean(customer.country_other)
    elif inquiry and not _is_placeholder(inquiry.destination):
        destination_country = _clean(inquiry.destination)

    if destination_country and not destination_port:
        matched = ExportCountry.objects.filter(name__iexact=destination_country).first()
        if matched:
            destination_country = matched.name
            destination_port = _ports_display(matched)

    volume = _clean(inquiry.volume) if inquiry else ""
    incoterms = _clean(inquiry.incoterms) if inquiry else ""

    return {
        "pre_carriage_by": "Road / Rail",
        "place_of_pre_carriage": place_pre_carriage,
        "port_of_loading": port_loading,
        "vessel_flight_no": "",
        "port_of_discharge": destination_port,
        "final_destination": destination_country,
        "country_of_origin": country_origin,
        "country_of_final_destination": destination_country,
        "volume_shipment": volume,
        "incoterms": incoterms,
    }


def resolve_invoice_shipping(invoice, exporter_office=None) -> dict:
    """Values for the printed invoice — stored fields first, then smart fallbacks."""
    inquiry = getattr(invoice, "inquiry", None)
    customer = inquiry.customer if inquiry and inquiry.customer_id else None
    suggested = suggest_invoice_shipping(inquiry, exporter_office, customer)

    def display(field: str) -> str:
        stored = _clean(getattr(invoice, field, ""))
        if stored:
            return stored
        fallback = suggested.get(field, "")
        return fallback if fallback else "—"

    final_dest = display("final_destination")
    country_final = display("country_of_final_destination")
    if country_final == "—" and final_dest != "—":
        country_final = final_dest

    country_origin = display("country_of_origin")
    trade_route = f"{country_origin} → {final_dest}" if final_dest != "—" else country_origin

    return {
        "pre_carriage_by": display("pre_carriage_by"),
        "place_pre_carriage": display("place_of_pre_carriage"),
        "port_loading": display("port_of_loading"),
        "vessel_flight_no": display("vessel_flight_no"),
        "port_discharge": display("port_of_discharge"),
        "final_destination": final_dest,
        "country_origin": country_origin,
        "country_final": country_final,
        "volume": display("volume_shipment"),
        "incoterms": display("incoterms"),
        "trade_route": trade_route,
        "place_of_supply": final_dest if final_dest != "—" else country_final,
    }
