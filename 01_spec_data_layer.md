# DeskFlow SDD: Spec & Data Layer

## 1. Problem Statement
Build an open-access co-working desk and room reservation management web app (DeskFlow) using Spec-Driven Development (SDD). All design and implementation steps are documented and confirmed before coding.

## 2. Core Constraints & Architecture
- **Frontend:** React (Vite, Tailwind or CSS, hooks, accessible UI)
- **Backend:** FastAPI (Python)
- **Persistence:** SQLite (SQLAlchemy) or JSON file (with locking)
- **Authentication:** None (anonymous access)

## 3. Domain Entities & Schemas

### SpaceUnit
- id: string (UUID)
- code: string (e.g., "DESK-101")
- type: enum [desk, booth, meeting_room]
- capacity: int
- has_monitor: bool
- is_active: bool

### Reservation
- id: string (UUID)
- space_id: string
- reserved_by: string
- start_time: ISO 8601 string
- end_time: ISO 8601 string
- guest_count: int
- amenities: list of strings
- status: enum [confirmed, occupied, cancelled, completed]
- created_at: ISO 8601 string

## 4. Business Operations (API Endpoints)
1. Create Reservation (POST /api/reservations)
2. Cancel Reservation (DELETE/PATCH)
3. Reschedule Reservation (PATCH)
4. Switch/Reassign Space (PATCH)
5. Toggle Amenity Add-Ons (PATCH)
6. Claim Instant Walk-Up (POST)
7. Toggle Space Maintenance (PATCH)
8. Purge/Archive Expired Bookings (POST)
9. Keep the ready to use Customer support, add chat bot to help with all the activities and option to connect with human agents.

## 5. Next Steps
- [x] Confirm schemas and data layer design
- [ ] Proceed to detailed API spec and storage design

---
**Please review this spec. Confirm or request changes before I proceed to detailed API and storage design.**
