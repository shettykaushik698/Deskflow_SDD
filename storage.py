import json
import threading
from pathlib import Path
from typing import List
from schemas import SpaceUnit, Reservation

DATA_FILE = Path("data.json")
LOCK = threading.Lock()

# Seed data: 3 desks, 2 booths, 1 meeting room
SEED_SPACES = [
    SpaceUnit(code="DESK-101", type="desk", capacity=1, has_monitor=True),
    SpaceUnit(code="DESK-102", type="desk", capacity=1, has_monitor=False),
    SpaceUnit(code="DESK-103", type="desk", capacity=1, has_monitor=True),
    SpaceUnit(code="BOOTH-A", type="booth", capacity=2, has_monitor=False),
    SpaceUnit(code="BOOTH-B", type="booth", capacity=2, has_monitor=True),
    SpaceUnit(code="CONF-MAIN", type="meeting_room", capacity=8, has_monitor=True),
]

class Storage:
    def __init__(self, path=DATA_FILE):
        self.path = path
        if not self.path.exists():
            self._save({"spaces": [s.dict() for s in SEED_SPACES], "reservations": []})

    def _load(self):
        with LOCK:
            with open(self.path, "r") as f:
                return json.load(f)

    def _save(self, data):
        with LOCK:
            with open(self.path, "w") as f:
                json.dump(data, f, indent=2)

    def get_spaces(self) -> List[SpaceUnit]:
        data = self._load()
        return [SpaceUnit(**s) for s in data["spaces"]]

    def get_reservations(self) -> List[Reservation]:
        data = self._load()
        return [Reservation(**r) for r in data["reservations"]]

    # Additional CRUD methods will be implemented for all business operations
