# DeskFlow Application Design

## 1. Overview
DeskFlow is a modular, open-access co-working desk and room reservation system. The app is structured for clarity, maintainability, and strict SDD compliance.

## 2. High-Level Architecture
- **Frontend:** React (Vite, Tailwind CSS or standard CSS)
- **Backend:** FastAPI (Python)
- **Persistence:** SQLite (SQLAlchemy) or JSON file

## 3. Directory Structure (Proposed)

```
Deskflow/
├── backend/
│   ├── main.py           # FastAPI app entrypoint
│   ├── schemas.py        # Pydantic models
│   ├── storage.py        # Persistence logic
│   ├── seed_data.py      # Initial space/room data
│   └── requirements.txt  # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── SpaceGrid.jsx
│   │   │   ├── BookingPanel.jsx
│   │   │   ├── ReservationsManager.jsx
│   │   │   └── BulkActionBar.jsx
│   │   ├── api/
│   │   │   └── deskflowApi.js
│   │   └── index.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 4. Component Overview
- **SpaceGrid:** Visualizes all spaces, types, and statuses
- **BookingPanel:** Form for new reservations and walk-ups
- **ReservationsManager:** List/table of active reservations with actions
- **BulkActionBar:** Purge/archive expired bookings

## 5. Backend Modules
- **schemas.py:** Pydantic models for SpaceUnit, Reservation, and all API requests/responses
- **storage.py:** CRUD logic, conflict checks, seed data
- **main.py:** FastAPI app, CORS, all endpoints

## 6. Frontend Modules
- **deskflowApi.js:** API client for backend
- **App.jsx:** Main app shell
- **Components:** UI modules as above

---
**Ready to build on your command.**
