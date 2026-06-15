import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-insecure-change-in-production")

DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "catalog",
    "inquiries",
    "desk",
    "documents",
    "customers",
    "master",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "desk.context_processors.desk_alerts",
                'config.context_processors.settings_context',  # Expose Django settings in templates
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

USE_POSTGRES = os.environ.get("USE_POSTGRES", "").lower() in ("true", "1", "yes")

if USE_POSTGRES:
    _pg_password = os.environ.get("POSTGRES_PASSWORD", "")
    if not _pg_password:
        raise ImproperlyConfigured(
            "POSTGRES_PASSWORD is empty in backend/.env. "
            "Set it to the password you chose when installing PostgreSQL 18, then run migrate again. "
            "Example: POSTGRES_PASSWORD=your_secret_password"
        )
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("POSTGRES_DB", "sundaram_export"),
            "USER": os.environ.get("POSTGRES_USER", "postgres"),
            "PASSWORD": _pg_password,
            "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
            "PORT": os.environ.get("POSTGRES_PORT", "5433"),
            "OPTIONS": {
                "connect_timeout": 10,
            },
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Export desk dashboard (/desk/) — Django admin stays at /admin/
LOGIN_URL = "/desk/login/"
LOGIN_REDIRECT_URL = "/desk/"
DESK_BASE_URL = os.environ.get("DESK_BASE_URL", "http://127.0.0.1:8000/desk/")
ADMIN_BASE_URL = os.environ.get("ADMIN_BASE_URL", "http://127.0.0.1:8000/admin/")

CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    if o.strip()
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
    "DEFAULT_THROTTLE_RATES": {
        "inquiry": "30/min",
    },
}

DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@sundaramexport.com")
INQUIRY_NOTIFY_EMAIL = os.environ.get("INQUIRY_NOTIFY_EMAIL", "exports@sundaramexport.com")
INQUIRY_NOTIFY_EMAILS = [
    e.strip()
    for e in os.environ.get("INQUIRY_NOTIFY_EMAILS", INQUIRY_NOTIFY_EMAIL).split(",")
    if e.strip()
]

_use_smtp = (
    os.environ.get("EMAIL_HOST", "").strip()
    and os.environ.get("EMAIL_HOST_USER", "").strip()
    and os.environ.get("EMAIL_HOST_PASSWORD", "").strip()
)

if _use_smtp:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
    EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
    EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
    EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True").lower() in ("true", "1", "yes")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"



# Company Basic Details  --------------------------------------------------
# Company Branding Settings
COMPANY_NAME = os.environ.get("COMPANY_NAME", "Sundaram Export")
COMPANY_NAME_INIT = " ".join([word[0].upper() for word in COMPANY_NAME.split()])
COMPANY_LOGO = os.environ.get("COMPANY_LOGO", "config/images/company_logo.svg")
COMPANY_LOGO_TRANSPARENT = os.environ.get("COMPANY_LOGO_TRANSPARENT", "config/images/company_logo.svg")
COMPANY_CONTACT = os.environ.get('COMPANY_CONTACT', '8000000000')
COMPANY_EMAIL = os.environ.get('COMPANY_EMAIL', 'test@gmail.com')

# Optional: Full path for easier use
COMPANY_LOGO_URL = COMPANY_LOGO
COMPANY_LOGO_TRANSPARENT_URL = COMPANY_LOGO_TRANSPARENT