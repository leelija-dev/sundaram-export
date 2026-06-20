#!/bin/sh
set -e

if [ "${USE_POSTGRES}" = "True" ] || [ "${USE_POSTGRES}" = "true" ] || [ "${USE_POSTGRES}" = "1" ]; then
  echo "Waiting for PostgreSQL at ${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432}..."
  python <<'PY'
import os
import sys
import time

import psycopg

host = os.environ.get("POSTGRES_HOST", "db")
port = int(os.environ.get("POSTGRES_PORT", "5432"))
dbname = os.environ.get("POSTGRES_DB", "sundaram_export")
user = os.environ.get("POSTGRES_USER", "postgres")
password = os.environ.get("POSTGRES_PASSWORD", "")

for attempt in range(60):
    try:
        with psycopg.connect(
            host=host,
            port=port,
            dbname=dbname,
            user=user,
            password=password,
            connect_timeout=3,
        ):
            break
    except psycopg.OperationalError:
        time.sleep(1)
else:
    sys.exit("PostgreSQL is not ready.")
PY
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ "${SEED_MASTER_ON_START:-false}" = "true" ]; then
  python manage.py seed_master || true
fi

exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-2}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
