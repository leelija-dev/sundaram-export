# Sundaram Export — Django API

REST API for catalog content and contact / quote inquiries.

## Requirements

- Python 3.11+
- pip
- PostgreSQL 14+ (default database)

## Setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API base: [http://127.0.0.1:8000/api/v1/](http://127.0.0.1:8000/api/v1/)

| URL | Purpose |
|-----|---------|
| [http://127.0.0.1:8000/desk/](http://127.0.0.1:8000/desk/) | **Admin management portal** — analytics, products, export countries, inquiries, invoices, reports |
| [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) | **Django admin** — users, groups, and advanced/raw data access |

Use a staff superuser for `/desk/`. From the desk you can add/edit products, manage export countries, handle leads, create invoices (with line items + print), and generate export reports.

## Frontend connection

In `frontend/`, copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

Run Next.js (`npm run dev`) and Django (`runserver`) together.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health/` | Health check |
| GET | `/api/v1/products/` | Product list |
| GET | `/api/v1/products/<slug>/` | Product detail |
| GET | `/api/v1/countries/` | Export countries (Bangladesh, Dubai, etc.) |
| GET | `/api/v1/countries/<slug>/` | Export country detail |
| GET | `/api/v1/markets/` | Market regions (optional grouping) |
| GET | `/api/v1/markets/<slug>/` | Market detail |
| GET | `/api/v1/offices/` | Office locations |
| POST | `/api/v1/inquiries/` | Create contact or quote inquiry |

### POST `/api/v1/inquiries/`

**Contact example:**

```json
{
  "type": "contact",
  "name": "Jane Doe",
  "company": "Acme Imports",
  "email": "jane@acme.com",
  "phone": "+1 555 0100",
  "message": "Interested in spice exports to the EU."
}
```

**Quote example:**

```json
{
  "type": "quote",
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "origin": "Mumbai, India",
  "destination": "Houston, USA",
  "product_slug": "spices-oleoresins",
  "incoterms": "FOB Mumbai",
  "volume": "1×40ft FCL",
  "message": "Turmeric powder, steam sterilized."
}
```

Honeypot field `website` must be empty (spam protection).

Rate limit: 30 requests/minute per IP for anonymous clients.

## Email

With `DEBUG=True` and no `EMAIL_HOST`, inquiry notifications print to the console. Set SMTP variables in `.env` for production.

## PostgreSQL

Create the database once (psql or pgAdmin):

```sql
CREATE DATABASE sundaram_export;
```

Configure `.env` (defaults shown):

```
USE_POSTGRES=True
POSTGRES_DB=sundaram_export
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
```

> **Windows note:** If PostgreSQL 18 was installed with the default stack, it often listens on **5433** instead of 5432. Check with `netstat -an | findstr 543` if `migrate` times out.

Then:

```powershell
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

Add products and export countries via [http://127.0.0.1:8000/desk/](http://127.0.0.1:8000/desk/) after logging in.

Set `USE_POSTGRES=False` in `.env` only if you want to fall back to SQLite (`db.sqlite3`).
