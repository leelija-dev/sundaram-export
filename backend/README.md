# Sundaram Export — Django backend

REST API + export desk admin for catalog, inquiries, customers, and invoices.

## Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_master
python manage.py createsuperuser
python manage.py runserver
```

- **API:** http://127.0.0.1:8000/api/v1/health/
- **Desk:** http://127.0.0.1:8000/desk/login/
- **Admin:** http://127.0.0.1:8000/admin/

## Environment

Copy `.env.example` to `.env`. Key variables:

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django secret (required in production) |
| `USE_POSTGRES` | Set `True` for PostgreSQL; omit for SQLite |
| `POSTGRES_*` | Database connection when using PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | Next.js frontend origins |
| `COMPANY_NAME` | Branding in desk templates |
| `INQUIRY_NOTIFY_EMAIL` | Receives contact/quote form alerts |

## API endpoints (`/api/v1/`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/` | Health check |
| GET | `/categories/` | Active product categories |
| GET | `/products/` | Published products (summary) |
| GET | `/products/<slug>/` | Product detail |
| GET | `/countries/` | Export destinations |
| GET | `/countries/<slug>/` | Country detail |
| GET | `/markets/` | Market regions |
| GET | `/markets/<slug>/` | Region detail |
| GET | `/offices/` | Office locations |
| GET | `/offices/<id>/` | Office detail |
| POST | `/inquiries/` | Contact / quote submission (throttled) |

## Apps

| App | Role |
|-----|------|
| `catalog` | Products, markets, countries, offices + public API |
| `master` | Categories & currencies (reference data) |
| `inquiries` | Website lead capture |
| `customers` | CRM records (desk only) |
| `documents` | Invoices & reports (desk only) |
| `desk` | Staff admin portal |

## Common commands

```powershell
python manage.py seed_master          # default categories & currencies
python manage.py changepassword admin   # reset desk login
python manage.py migrate              # apply schema changes
```

## PostgreSQL note

If desk pages fail with missing column errors after pulling new code, run:

```powershell
python manage.py migrate
```
