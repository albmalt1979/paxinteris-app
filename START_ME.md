Start backend (FastAPI) and frontend (Expo) locally (dev):
1) Backend
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2) Frontend
   cd frontend
   npm install
   npm start
   Use Expo client or emulator. For Android emulator use 10.0.2.2 to reach backend at localhost.
