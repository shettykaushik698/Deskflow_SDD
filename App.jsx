import React, { useEffect, useState } from "react";
import "./styles.css";
import { fetchAPI } from "./deskflowApi";
import SpaceGrid from "./SpaceGrid";
import BookingPanel from "./BookingPanel";
import ReservationsManager from "./ReservationsManager";
import BulkActionBar from "./BulkActionBar";
import CustomerSupport from "./CustomerSupport";

export default function App() {
  const [spaces, setSpaces] = useState([]);
  const [reservations, setReservations] = useState([]);

  const loadData = async () => {
    const [spacesData, reservationsData] = await Promise.all([
      fetchAPI("/api/spaces"),
      fetchAPI("/api/reservations"),
    ]);

    setSpaces(spacesData);
    setReservations(reservationsData);
  };

  useEffect(() => {
    loadData().catch((error) => console.error(error));
  }, []);

  const handleBook = async (payload) => {
    const reservation = {
      ...payload,
      created_at: new Date().toISOString(),
      status: "confirmed",
      amenities: payload.amenities || [],
    };

    await fetchAPI("/api/reservations", {
      method: "POST",
      body: JSON.stringify(reservation),
    });

    await loadData();
  };

  const handleWalkup = async (spaceId, reservedBy) => {
    await fetchAPI(`/api/spaces/${spaceId}/walk-up?reserved_by=${encodeURIComponent(reservedBy)}`, {
      method: "POST",
    });
    await loadData();
  };

  const handleToggleMaintenance = async (spaceId, currentStatus) => {
    await fetchAPI(`/api/spaces/${spaceId}/maintenance?is_active=${!currentStatus}`, {
      method: "PATCH",
    });
    await loadData();
  };

  const handleCancelReservation = async (reservationId) => {
    await fetchAPI(`/api/reservations/${reservationId}`, { method: "DELETE" });
    await loadData();
  };

  const handleRescheduleReservation = async (reservationId, startTime, endTime) => {
    const params = new URLSearchParams({
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
    });

    await fetchAPI(`/api/reservations/${reservationId}/reschedule?${params.toString()}`, {
      method: "PATCH",
    });
    await loadData();
  };

  const handleReassignReservation = async (reservationId, newSpaceId) => {
    const params = new URLSearchParams({ new_space_id: newSpaceId });

    await fetchAPI(`/api/reservations/${reservationId}/reassign?${params.toString()}`, {
      method: "PATCH",
    });
    await loadData();
  };

  const handlePurge = async () => {
    await fetchAPI("/api/reservations/purge", { method: "POST" });
    await loadData();
  };

  const activeSpaces = spaces.filter((space) => space.is_active).length;
  const activeReservations = reservations.filter((reservation) => reservation.status === "confirmed").length;

  return (
    <div className="app-shell">
      <h1>DeskFlow Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Total spaces</span>
          <strong>{spaces.length}</strong>
        </div>
        <div className="summary-card">
          <span>Active spaces</span>
          <strong>{activeSpaces}</strong>
        </div>
        <div className="summary-card">
          <span>Upcoming bookings</span>
          <strong>{activeReservations}</strong>
        </div>
      </div>

      <SpaceGrid
        spaces={spaces}
        onWalkup={handleWalkup}
        onToggleMaintenance={handleToggleMaintenance}
      />
      <BookingPanel spaces={spaces} onBook={handleBook} />
      <ReservationsManager
        reservations={reservations}
        spaces={spaces}
        onCancel={handleCancelReservation}
        onReschedule={handleRescheduleReservation}
        onReassign={handleReassignReservation}
      />
      <BulkActionBar onPurge={handlePurge} />
      <CustomerSupport />
    </div>
  );
}
