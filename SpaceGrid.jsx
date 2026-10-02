import React from "react";

export default function SpaceGrid({ spaces, onWalkup, onToggleMaintenance }) {
  return (
    <div className="grid">
      {spaces.map((space) => (
        <div key={space.id} className="space-card">
          <strong>{space.code}</strong>
          <div>Type: {space.type}</div>
          <div>Capacity: {space.capacity}</div>
          <div>{space.has_monitor ? "Monitor" : "No Monitor"}</div>
          <div className={space.is_active ? "status" : "status inactive"}>
            Status: {space.is_active ? "Active" : "Maintenance"}
          </div>
          <div className="card-actions">
            <button type="button" onClick={() => onWalkup(space.id, "Walk-up guest")}>
              Walk-up
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onToggleMaintenance(space.id, space.is_active)}
            >
              {space.is_active ? "Set maintenance" : "Set active"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
