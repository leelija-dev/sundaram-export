"""Resolve exporter company details from .env settings with Office fallbacks."""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.conf import settings

if TYPE_CHECKING:
    from catalog.models import Office


def get_exporter_office() -> Office | None:
    from catalog.models import Office

    return (
        Office.objects.filter(is_published=True)
        .order_by("sort_order", "region")
        .first()
    )


def resolve_exporter_company(exporter_office: Office | None = None) -> dict:
    """
    Build display-ready exporter details.

    Priority: COMPANY_* values in .env, then the first published Office record.
    """
    office = exporter_office if exporter_office is not None else get_exporter_office()

    address_env = (settings.COMPANY_ADDRESS or "").strip()
    if address_env:
        address_region = ""
        address_body = address_env
    elif office:
        address_region = (office.region or "").strip()
        address_body = (office.address or "").strip()
    else:
        address_region = ""
        address_body = ""

    address_parts = [part for part in (address_region, address_body) if part]
    address_display = "\n".join(address_parts)

    phone = (settings.COMPANY_CONTACT or "").strip()
    if not phone and office:
        phone = (office.phone or "").strip()

    email = (settings.COMPANY_EMAIL or "").strip()
    if not email and office:
        email = (office.email or "").strip()

    return {
        "name": settings.COMPANY_NAME,
        "tagline": settings.COMPANY_TAGLINE,
        "address": address_display,
        "address_region": address_region,
        "address_body": address_body,
        "phone": phone,
        "email": email,
        "website": (settings.COMPANY_WEBSITE or "").strip(),
        "gstin": (settings.COMPANY_GSTIN or "").strip(),
    }
