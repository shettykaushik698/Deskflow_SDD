from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import SpaceUnit, Reservation
from storage import Storage

app = FastAPI()

# Enable CORS for all origins (for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = Storage()

@app.get("/api/spaces", response_model=List[SpaceUnit])
def list_spaces():
    return store.get_spaces()

@app.get("/api/reservations", response_model=List[Reservation])
def list_reservations():
    return store.get_reservations()

from fastapi import HTTPException
from datetime import datetime, timedelta
from schemas import ReservationStatus

@app.post("/api/reservations", response_model=Reservation)
def create_reservation(reservation: Reservation):
    # Prevent double-booking
    reservations = store.get_reservations()
    for r in reservations:
        if r.space_id == reservation.space_id and not (
            reservation.end_time <= r.start_time or reservation.start_time >= r.end_time
        ) and r.status in [ReservationStatus.confirmed, ReservationStatus.occupied]:
            raise HTTPException(status_code=409, detail="Space already booked for this time.")
    # Save reservation
    data = store._load()
    data["reservations"].append(reservation.dict())
    store._save(data)
    return reservation

@app.delete("/api/reservations/{id}")
def cancel_reservation(id: str):
    data = store._load()
    found = False
    for r in data["reservations"]:
        if r["id"] == id:
            r["status"] = ReservationStatus.cancelled
            found = True
    if not found:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    store._save(data)
    return {"ok": True}

@app.patch("/api/reservations/{id}/reschedule", response_model=Reservation)
def reschedule_reservation(id: str, start_time: str, end_time: str):
    data = store._load()
    found = None
    for r in data["reservations"]:
        if r["id"] == id:
            found = r
            break
    if not found:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    # Conflict check
    for r in data["reservations"]:
        if r["space_id"] == found["space_id"] and r["id"] != id and not (
            end_time <= r["start_time"] or start_time >= r["end_time"]
        ) and r["status"] in [ReservationStatus.confirmed, ReservationStatus.occupied]:
            raise HTTPException(status_code=409, detail="Space already booked for this time.")
    found["start_time"] = start_time
    found["end_time"] = end_time
    store._save(data)
    return found

@app.patch("/api/reservations/{id}/reassign", response_model=Reservation)
def reassign_reservation(id: str, new_space_id: str):
    data = store._load()
    found = None
    for r in data["reservations"]:
        if r["id"] == id:
            found = r
            break
    if not found:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    # Check compatible type
    spaces = {s["id"]: s for s in data["spaces"]}
    if new_space_id not in spaces:
        raise HTTPException(status_code=404, detail="Space not found.")
    if spaces[new_space_id]["type"] != spaces[found["space_id"]]["type"]:
        raise HTTPException(status_code=409, detail="Space type mismatch.")
    # Conflict check
    for r in data["reservations"]:
        if r["space_id"] == new_space_id and not (
            found["end_time"] <= r["start_time"] or found["start_time"] >= r["end_time"]
        ) and r["status"] in [ReservationStatus.confirmed, ReservationStatus.occupied]:
            raise HTTPException(status_code=409, detail="Space already booked for this time.")
    found["space_id"] = new_space_id
    store._save(data)
    return found

@app.patch("/api/reservations/{id}/amenities", response_model=Reservation)
def toggle_amenities(id: str, amenities: List[str]):
    data = store._load()
    found = None
    for r in data["reservations"]:
        if r["id"] == id:
            found = r
            break
    if not found:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    found["amenities"] = amenities
    store._save(data)
    return found

@app.post("/api/spaces/{id}/walk-up", response_model=Reservation)
def walkup_reservation(id: str, reserved_by: str):
    data = store._load()
    # Check space exists and is active
    space = None
    for s in data["spaces"]:
        if s["id"] == id and s["is_active"]:
            space = s
            break
    if not space:
        raise HTTPException(status_code=404, detail="Space not available.")
    # Check for conflicts
    now = datetime.utcnow().isoformat()
    end = (datetime.utcnow() + timedelta(hours=2)).isoformat()
    for r in data["reservations"]:
        if r["space_id"] == id and not (
            end <= r["start_time"] or now >= r["end_time"]
        ) and r["status"] in [ReservationStatus.confirmed, ReservationStatus.occupied]:
            raise HTTPException(status_code=409, detail="Space already booked.")
    from uuid import uuid4
    reservation = {
        "id": str(uuid4()),
        "space_id": id,
        "reserved_by": reserved_by,
        "start_time": now,
        "end_time": end,
        "guest_count": 1,
        "amenities": [],
        "status": ReservationStatus.confirmed,
        "created_at": now,
    }
    data["reservations"].append(reservation)
    store._save(data)
    return reservation

@app.patch("/api/spaces/{id}/maintenance")
def toggle_maintenance(id: str, is_active: bool):
    data = store._load()
    found = None
    for s in data["spaces"]:
        if s["id"] == id:
            found = s
            break
    if not found:
        raise HTTPException(status_code=404, detail="Space not found.")
    found["is_active"] = is_active
    store._save(data)
    return found

@app.post("/api/reservations/purge")
def purge_expired():
    data = store._load()
    now = datetime.utcnow().isoformat()
    count = 0
    for r in data["reservations"]:
        if r["end_time"] < now and r["status"] not in [ReservationStatus.completed, ReservationStatus.cancelled]:
            r["status"] = ReservationStatus.completed
            count += 1
    store._save(data)
    return {"purged": count}
