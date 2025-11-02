# Tournament Manager (MVP) - Starter Kit

This package contains a minimal, ready-to-run starter for a Tournament Management app:
- backend: FastAPI + SQLite (./backend)
- frontend: Expo React Native demo app (./frontend)

How to run backend (quick):
1. cd backend
2. python -m venv .venv
3. source .venv/bin/activate
4. pip install -r requirements.txt
5. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

How to run frontend:
1. cd frontend
2. npm install
3. npm start
4. Use Expo to open the app (simulator or device). Default backend base URL is http://10.0.2.2:8000 for Android emulator.

This is an MVP scaffold. You can extend features: auth persistence, file uploads, push notifications, Stripe, PDF gen, calendar generator, role-based permissions, and more.
