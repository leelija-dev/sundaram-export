import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_inquiry_notification(inquiry) -> bool:
    """Notify export desk by email. Returns True if sent (or printed to console)."""
    product_title = inquiry.product.title if inquiry.product else "—"
    desk_url = f"{settings.DESK_BASE_URL.rstrip('/')}/inquiries/{inquiry.id}/"

    subject = f"🔔 New {inquiry.get_inquiry_type_display()} from website — {inquiry.name}"
    body = f"""New lead from the Sundaram Export website

Type: {inquiry.get_inquiry_type_display()}
Name: {inquiry.name}
Company: {inquiry.company or '—'}
Email: {inquiry.email}
Phone: {inquiry.phone or '—'}

Origin: {inquiry.origin or '—'}
Destination: {inquiry.destination or '—'}
Product: {product_title}
Incoterms: {inquiry.incoterms or '—'}
Volume: {inquiry.volume or '—'}

Message:
{inquiry.message}

---
Open in export desk: {desk_url}
Reference ID: {inquiry.id}
"""
    recipients = getattr(settings, "INQUIRY_NOTIFY_EMAILS", None) or [settings.INQUIRY_NOTIFY_EMAIL]

    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipients,
        fail_silently=False,
    )

    if settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
        logger.info(
            "Inquiry %s — notification printed in Django runserver console (configure SMTP in .env for real email).",
            inquiry.id,
        )
    else:
        logger.info("Inquiry %s — notification email sent to %s", inquiry.id, ", ".join(recipients))
    return True
