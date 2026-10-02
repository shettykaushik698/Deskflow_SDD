from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field

class SpaceType(str, Enum):
    desk = "desk"
    booth = "booth"
    meeting_room = "meeting_room"

class SpaceUnit(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    code: str
    type: SpaceType
    capacity: int
    has_monitor: bool
    is_active: bool = True

class ReservationStatus(str, Enum):
    confirmed = "confirmed"
    occupied = "occupied"
    cancelled = "cancelled"
    completed = "completed"

class Reservation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    space_id: str
    reserved_by: str
    start_time: str
    end_time: str
    guest_count: int
    amenities: List[str] = []
    status: ReservationStatus = ReservationStatus.confirmed
    created_at: str

# Request/response models can be extended as needed for each endpoint
