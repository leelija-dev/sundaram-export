"""Invoice QR links to a signed public URL that shows the print invoice."""

import base64
import io
import os

import qrcode
from django.conf import settings
from django.core.signing import BadSignature, Signer
from django.urls import reverse

_VERIFY_SALT = "desk.invoice.verify"
_signer = Signer(salt=_VERIFY_SALT)


def _qr_enabled() -> bool:
    raw = os.environ.get("INVOICE_QR_ENABLED", "").strip().lower()
    if raw in ("0", "false", "no", "off"):
        return False
    if raw in ("1", "true", "yes", "on"):
        return True
    flag = getattr(settings, "INVOICE_QR_ENABLED", None)
    if flag is not None:
        return bool(flag)
    return bool(settings.COMPANY_GSTIN)


def invoice_qr_needed(invoice) -> bool:
    """Show QR when exporter is GST-registered and invoice has billable totals."""
    if not _qr_enabled():
        return False
    if not settings.COMPANY_GSTIN:
        return False
    if not invoice.invoice_number or not invoice.issue_date:
        return False
    if invoice.total is None or invoice.total <= 0:
        return False
    return True


def make_invoice_verify_token(invoice) -> str:
    signed = _signer.sign(f"{invoice.pk}:{invoice.invoice_number}")
    return base64.urlsafe_b64encode(signed.encode()).decode().rstrip("=")


def load_invoice_verify_token(token: str) -> tuple[int, str]:
    padded = token + "=" * (-len(token) % 4)
    signed = base64.urlsafe_b64decode(padded.encode()).decode()
    value = _signer.unsign(signed)
    pk_str, invoice_number = value.split(":", 1)
    return int(pk_str), invoice_number


def _site_origin() -> str:
    from urllib.parse import urlparse

    parsed = urlparse(settings.DESK_BASE_URL)
    return f"{parsed.scheme}://{parsed.netloc}"


def _absolute_url(path: str, request=None) -> str:
    if request:
        return request.build_absolute_uri(path)
    return f"{_site_origin()}{path}"


def build_invoice_verify_url(invoice, request=None) -> str:
    token = make_invoice_verify_token(invoice)
    path = reverse("desk:invoice_verify", kwargs={"token": token})
    return _absolute_url(path, request)


def build_invoice_qr_image_url(invoice, request=None, *, verify_token: str | None = None) -> str:
    if verify_token:
        path = reverse("desk:invoice_verify_qr", kwargs={"token": verify_token})
    else:
        path = reverse("desk:invoice_qr", kwargs={"pk": invoice.pk})
    return _absolute_url(path, request)


def render_invoice_qr_png(invoice, request=None) -> bytes:
    url = build_invoice_verify_url(invoice, request)
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=4,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def invoice_qr_for_display(invoice, request=None, *, verify_token: str | None = None):
    if not invoice_qr_needed(invoice):
        return None
    verify_url = build_invoice_verify_url(invoice, request)
    return {
        "image_url": build_invoice_qr_image_url(
            invoice, request, verify_token=verify_token
        ),
        "title": invoice.invoice_number,
        "url": verify_url,
    }


def resolve_invoice_from_verify_token(token: str):
    """Return Invoice for a valid verify token, or None."""
    from documents.models import Invoice

    try:
        pk, invoice_number = load_invoice_verify_token(token)
    except (BadSignature, ValueError, UnicodeDecodeError):
        return None
    return Invoice.objects.filter(pk=pk, invoice_number=invoice_number).first()
