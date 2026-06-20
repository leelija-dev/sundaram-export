# Sundaram Export

Multinational export company platform — **product & service catalog** with **contact / quote** lead capture for customers who want to export.

## Repository structure

```
Sundaram Export/
├── frontend/          # Next.js public website
├── backend/           # Django REST API (catalog + inquiries)
├── docs/
│   └── ARCHITECTURE.md   # System design & roadmap
└── README.md          # This file
```

## Quick start

**Frontend**

```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Backend** (separate terminal — see [backend/README.md](backend/README.md))

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: [http://127.0.0.1:8000/api/v1/health/](http://127.0.0.1:8000/api/v1/health/)

## Docker deployment

For production-style deployment with PostgreSQL, nginx, and all services:

```powershell
copy .env.docker.example .env.docker
docker compose --env-file .env.docker up --build -d
docker compose --env-file .env.docker exec backend python manage.py createsuperuser
```

See **[docs/DOCKER.md](docs/DOCKER.md)** for full configuration, architecture, and operations.

## Customer flow (v1)

1. Browse **products** and **services**
2. View details (specs, markets, HS codes)
3. **Request a quote** or **contact** the export desk
4. Sales team follows up (email / phone — outside the app today)

## Architecture

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for:

- Current vs target architecture
- Domain model (products, services, inquiries)
- API design for Phase 1
- Deployment and phased roadmap

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Django 5, Django REST Framework, SQLite (PostgreSQL optional)
- Catalog content: managed in `/desk/` or `/admin/` (PostgreSQL); frontend still uses `frontend/src/data/` for pages until wired to the API
- Contact / quote forms POST to `POST /api/v1/inquiries/`
