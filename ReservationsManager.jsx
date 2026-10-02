import React, { useMemo, useState } from "react";

function toLocalDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function ReservationRow({ reservation, spaces, onCancel, onReschedule, onReassign }) {
  const [startTime, setStartTime] = useState(toLocalDateTime(reservation.start_time));
  const [endTime, setEndTime] = useState(toLocalDateTime(reservation.end_time));
  const [selectedSpaceId, setSelectedSpaceId] = useState(reservation.space_id);

  return (
    <tr>
      <td>{reservation.reserved_by}</td>
      <td>{reservation.space_id}</td>
      <td>
        {new Date(reservation.start_time).toLocaleString()} -
        <br />
        {new Date(reservation.end_time).toLocaleString()}
      </td>
      <td>
        <span className={`status-pill ${reservation.status}`}>
          {reservation.status}
        </span>
      </td>
      <td>
        <div className="reservation-actions">
          <div className="mini-grid">
            <label>
              Start
              <input
                type="datetime-local"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </label>
            <label>
              End
              <input
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </label>
            <label>
              Move to
              <select
                value={selectedSpaceId}
                onChange={(event) => setSelectedSpaceId(event.target.value)}
              >
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.code}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="action-row">
            <button type="button" onClick={() => onReschedule(reservation.id, startTime, endTime)}>
              Reschedule
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onReassign(reservation.id, selectedSpaceId)}
            >
              Reassign
            </button>
            <button type="button" className="secondary-button" onClick={() => onCancel(reservation.id)}>
              Cancel
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ReservationsManager({ reservations, spaces, onCancel, onReschedule, onReassign }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleReservations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const matchesText =
        !query ||
        reservation.reserved_by.toLowerCase().includes(query) ||
        reservation.space_id.toLowerCase().includes(query) ||
        reservation.status.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;

      return matchesText && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  if (!reservations.length) {
    return (
      <div className="manager-box empty-state">
        <h2>Reservations</h2>
        <p>No reservations yet.</p>
      </div>
    );
  }

  return (
    <div className="manager-box">
      <h2>Reservations</h2>
      <div className="reservation-toolbar">
        <input
          type="text"
          placeholder="Search guest, space, or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="occupied">Occupied</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {visibleReservations.length === 0 ? (
        <p className="empty-state-text">No reservations match your filters.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Space</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleReservations.map((reservation) => (
                <ReservationRow
                  key={reservation.id}
                  reservation={reservation}
                  spaces={spaces}
                  onCancel={onCancel}
                  onReschedule={onReschedule}
                  onReassign={onReassign}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
