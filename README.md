# TIPI Website

This repository is split into two independently deployable apps:

- `frontend/` - React + Vite public website and CMS portal UI
- `backend/` - Django REST API, Django admin, CMS models, and MySQL integration

## Run locally

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open the public website at `http://127.0.0.1:5173/`.
Open Django admin at `http://127.0.0.1:8000/admin/`.

## Independent deployment

Frontend deployment root: `frontend`

- Build command: `npm run build`
- Output directory: `dist`
- Required env: `VITE_API_BASE_URL=https://your-backend-domain/api/v1`

Backend deployment root: `backend`

- Install command: `pip install -r requirements.txt`
- Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Required env: values from `backend/.env.example`
- Run migrations after deployment: `python manage.py migrate`

For production, set `DJANGO_DEBUG=0`, add the backend domain to `DJANGO_ALLOWED_HOSTS`, and add the frontend domain to `CORS_ALLOWED_ORIGINS`.
