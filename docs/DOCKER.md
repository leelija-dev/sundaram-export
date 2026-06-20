# Docker deployment

Run the full Sundaram Export stack (PostgreSQL, Django API + desk, Next.js site, nginx) with Docker Compose.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2)
- Ports **80** (or your chosen `HTTP_PORT`) available on the host

## Quick start

From the repository root:

```powershell
copy .env.docker.example .env.docker
# Edit .env.docker — set POSTGRES_PASSWORD and SECRET_KEY at minimum
docker compose --env-file .env.docker up --build -d
```

Open:

| Service | URL |
|---------|-----|
| Public website | http://localhost |
| Export desk | http://localhost/desk/login/ |
| Django admin | http://localhost/admin/ |
| API health | http://localhost/api/v1/health/ |

## First-time setup

Create a desk/admin user after containers are running:

```powershell
docker compose --env-file .env.docker exec backend python manage.py createsuperuser
```

Optional — load default categories and currencies (also runs automatically when `SEED_MASTER_ON_START=true`):

```powershell
docker compose --env-file .env.docker exec backend python manage.py seed_master
```

## Architecture

```
Browser → nginx:80
            ├── /              → frontend (Next.js)
            ├── /api/          → backend (Django + Gunicorn)
            ├── /desk/         → backend
            ├── /admin/        → backend
            ├── /media/        → shared volume (uploads)
            └── /static/       → shared volume (collectstatic)
          backend → db (PostgreSQL)
```

- **nginx** terminates HTTP and serves uploaded media and collected static files from Docker volumes.
- **frontend** uses `API_INTERNAL_URL` for server-side API calls inside the Docker network, and `NEXT_PUBLIC_API_URL` (baked at build time) for browser requests.
- **backend** runs migrations and `collectstatic` on startup via `docker-entrypoint.sh`.

## Configuration

Copy `.env.docker.example` to `.env.docker`. Important variables:

| Variable | Purpose |
|----------|---------|
| `PUBLIC_SITE_URL` | Public site URL (no trailing slash). Used when building the frontend and for CORS/CSRF. |
| `POSTGRES_PASSWORD` | Database password (required) |
| `SECRET_KEY` | Django secret (required in production) |
| `DEBUG` | Keep `False` for deployment |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `CSRF_TRUSTED_ORIGINS` | Origins for desk/admin forms (include `http://localhost` or your domain) |
| `CORS_ALLOWED_ORIGINS` | Origins allowed to call the API from the browser |
| `HTTP_PORT` | Host port mapped to nginx (default `80`) |

If you deploy to a real domain, set `PUBLIC_SITE_URL=https://www.yourdomain.com`, update `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, and `CORS_ALLOWED_ORIGINS`, then **rebuild the frontend**:

```powershell
docker compose --env-file .env.docker build frontend
docker compose --env-file .env.docker up -d
```

## Common commands

```powershell
# View logs
docker compose --env-file .env.docker logs -f

# Stop stack
docker compose --env-file .env.docker down

# Stop and remove database volume (destructive)
docker compose --env-file .env.docker down -v

# Run Django management commands
docker compose --env-file .env.docker exec backend python manage.py migrate
docker compose --env-file .env.docker exec backend python manage.py changepassword admin

# Rebuild after code changes
docker compose --env-file .env.docker up --build -d
```

## Production notes

- Put TLS termination in front of nginx (e.g. Caddy, Traefik, or a cloud load balancer) and set `PUBLIC_SITE_URL` to your HTTPS URL.
- Configure SMTP in `.env.docker` so inquiry emails are delivered instead of logged to the console.
- Back up the `postgres_data` and `media_data` Docker volumes regularly.
- For a server without nginx in front, you can expose backend and frontend directly by commenting out the nginx service and setting `SERVE_MEDIA=True` on the backend — the default compose file is intended for single-host deployment behind nginx.

## Local development without Docker

Continue using the existing dev workflow in [README.md](../README.md) and [backend/README.md](../backend/README.md). Docker is for deployment and staging, not required for day-to-day coding.
