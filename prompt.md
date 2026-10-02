Act as a Principal Full-Stack Software Engineer and System Architect. 

Build a complete, functional prototype for "DeskFlow" — an open-access co-working desk and room reservation management web application built strictly following the Spec-Driven Development (SDD) approach. Create .md files with all design and functionality and approach step by step and only proceed to creation of actual project files after confirmation by me.

---

### 1. Core Constraints & Architecture
- **Methodology (SDD):** Define the data contracts (Pydantic models / OpenAPI spec) first. All backend routes and frontend interfaces must strictly conform to these schema contracts.
- **Frontend:** React (modern functional components with hooks, clean styling, accessible UI, rapid prototyping using Vite/Tailwind or standard CSS).
- **Backend:** Python using FastAPI.
- **Persistence:** Local persistence without external servers (use SQLite via SQLAlchemy OR a structured JSON file storage mechanism with file locking).
- **Authentication:** NO login or password authentication required. All views and operations must be accessible anonymously.

---

### 2. Domain Entities & Schemas
Define strict schemas for the following resources:

1. **SpaceUnit**:
   - `id` (string / UUID)
   - `code` (e.g., "DESK-101", "BOOTH-A", "CONF-MAIN")
   - `type` (Enum: `desk`, `booth`, `meeting_room`)
   - `capacity` (int)
   - `has_monitor` (bool)
   - `is_active` (bool)

2. **Reservation**:
   - `id` (string / UUID)
   - `space_id` (string)
   - `reserved_by` (string, e.g., name or alias)
   - `start_time` (ISO 8601 string)
   - `end_time` (ISO 8601 string)
   - `guest_count` (int)
   - `amenities` (List of strings, e.g., ["whiteboard", "av_kit"])
   - `status` (Enum: `confirmed`, `occupied`, `cancelled`, `completed`)
   - `created_at` (ISO 8601 string)

---

### 3. The 8 Required Business Operations
Expose RESTful endpoints and React UI interactions for each of these:

1. **Create Reservation (`POST /api/reservations`):** Book an available space for a given time window. Prevent double-booking overlapping time slots for the same space.
2. **Cancel Reservation (`DELETE /api/reservations/{id}` or `PATCH .../cancel`):** Cancel an existing reservation, releasing the space.
3. **Reschedule Reservation (`PATCH /api/reservations/{id}/reschedule`):** Update `start_time` and `end_time` with conflict checks.
4. **Switch / Reassign Space (`PATCH /api/reservations/{id}/reassign`):** Transfer an existing reservation to another available `space_id` of compatible type.
5. **Toggle Amenity Add-Ons (`PATCH /api/reservations/{id}/amenities`):** Add or remove reserved amenities (e.g., projector, standing desk converter, AV kit).
6. **Claim Instant Walk-Up (`POST /api/spaces/{id}/walk-up`):** One-click operation to reserve an empty space immediately for 2 hours under a guest alias.
7. **Toggle Space Maintenance State (`PATCH /api/spaces/{id}/maintenance`):** Mark a desk/room out-of-order (`is_active = false`), blocking future reservations.
8. **Purge / Archive Expired Bookings (`POST /api/reservations/purge`):** Batch operation that clears or marks all past past-due bookings as `completed`.

---

### 4. Implementation Steps & Deliverables

Please provide production-grade, modular code in the following order:

#### Step 1: Spec & Data Layer (Backend)
- Define `schemas.py` containing all Pydantic request/response models.
- Set up `storage.py` handling data persistence (SQLite or JSON store) with seed data (at least 6 diverse spaces: 3 desks, 2 phone booths, 1 meeting room).

#### Step 2: API Endpoints (Backend)
- Implement `main.py` (FastAPI app with CORS middleware enabled).
- Implement all 8 endpoints with standard error handling (e.g., `404 Not Found`, `409 Conflict` on overlap).

#### Step 3: Frontend (React)
- Create the API client consuming the backend endpoints.
- Build the UI dashboard featuring:
  - **Space Grid / Visual Overview:** Showing spaces, types, and current status.
  - **Booking Panel:** Form to execute walk-ups and reservations with amenity selection.
  - **Active Reservations Manager:** List or table with action buttons for Reschedule, Switch Space, Toggle Amenities, Cancel, and Maintenance toggle.
  - **Bulk Action Bar:** Button to execute the "Purge Expired Bookings" operation.

Ensure all code blocks are complete, properly structured, and ready to run with clear execution instructions (`requirements.txt`, launch commands).
