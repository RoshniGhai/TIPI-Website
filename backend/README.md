# India Prosperity CMS Backend

This folder is deployable independently from the React/Vite frontend.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_dummy_content
python manage.py runserver 127.0.0.1:8000
```

## MySQL

The technical documentation specifies MySQL 8.x with PyMySQL. TablePlus is a database client, so MySQL Server still needs to be installed and running locally.

Create the database from TablePlus or the MySQL CLI using:

```sql
CREATE DATABASE IF NOT EXISTS tipi_cms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Optional local user setup is available in `backend/sql/create_database.sql`.

TablePlus connection:

- Host: `127.0.0.1`
- Port: `3306`
- Database: `tipi_cms`
- User: your local MySQL user, or `tipi_user` if you ran `backend/sql/create_database.sql`
- Password: your local MySQL password, or `tipi_password` for `tipi_user`

Then set:

```bash
MYSQL_DATABASE=tipi_cms
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
```

Recommended GUI: TablePlus for quick table browsing and editing, or DataGrip for a full database IDE.

Set the frontend API URL:

```bash
cd ..\frontend
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Production deployment

Use `backend` as the deployment root.

Start command:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Required environment variables are listed in `backend/.env.example`.
After the first deployment, run:

```bash
python manage.py migrate
```

## API

- `GET /api/v1/homepage/`
- `GET /api/v1/insights/`
- `GET /api/v1/insights/<slug>/`
- `GET /api/v1/events/`
- `GET /api/v1/events/<slug>/`
- `POST /api/v1/subscribers/`
- `POST /api/v1/contact-messages/`
- `POST /api/v1/insights/<slug>/comments/`
- `POST /api/v1/insights/<slug>/likes/`
- `POST /api/v1/events/<slug>/registrations/`

Only records with `status=published` or `status=approved`, `is_active=True`, and `published_at` in the past are returned. Insight media is linked through `InsightMedia.insight`, so homepage media tiles can route to the correct insight detail page.
