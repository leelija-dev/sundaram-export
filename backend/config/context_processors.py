from django.conf import settings

from config.static_branding import logo_mime_type, versioned_static_url
from desk.company_details import resolve_exporter_company


def settings_context(request):
    company = resolve_exporter_company()
    return {
        "setting": {
            "COMPANY_NAME": company["name"],
            "COMPANY_NAME_INIT": settings.COMPANY_NAME_INIT,
            "COMPANY_LOGO": settings.COMPANY_LOGO,
            "COMPANY_LOGO_TRANSPARENT": settings.COMPANY_LOGO_TRANSPARENT,
            "COMPANY_LOGO_URL": versioned_static_url(settings.COMPANY_LOGO),
            "COMPANY_LOGO_TRANSPARENT_URL": versioned_static_url(
                settings.COMPANY_LOGO_TRANSPARENT
            ),
            "COMPANY_LOGO_MIME": logo_mime_type(settings.COMPANY_LOGO_TRANSPARENT),
            "COMPANY_CONTACT": company["phone"],
            "COMPANY_EMAIL": company["email"],
            "COMPANY_TAGLINE": company["tagline"],
            "COMPANY_GSTIN": company["gstin"],
            "COMPANY_ADDRESS": company["address"],
            "COMPANY_WEBSITE": company["website"],
            "COMPANY_BANK_NAME": settings.COMPANY_BANK_NAME,
            "COMPANY_BANK_BRANCH": settings.COMPANY_BANK_BRANCH,
            "COMPANY_BANK_ACCOUNT": settings.COMPANY_BANK_ACCOUNT,
            "COMPANY_BANK_SWIFT": settings.COMPANY_BANK_SWIFT,
        },
        "exporter_company": company,
    }
