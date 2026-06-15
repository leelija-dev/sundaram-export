from django.conf import settings


def settings_context(request):
    return {
        "setting": {
            "COMPANY_NAME": settings.COMPANY_NAME,
            "COMPANY_NAME_INIT": settings.COMPANY_NAME_INIT,
            "COMPANY_LOGO": settings.COMPANY_LOGO,
            "COMPANY_LOGO_TRANSPARENT": settings.COMPANY_LOGO_TRANSPARENT,
            "COMPANY_LOGO_URL": settings.COMPANY_LOGO_URL,
            "COMPANY_LOGO_TRANSPARENT_URL": settings.COMPANY_LOGO_TRANSPARENT_URL,
            "COMPANY_CONTACT": settings.COMPANY_CONTACT,
            "COMPANY_EMAIL": settings.COMPANY_EMAIL,
        }
    }
