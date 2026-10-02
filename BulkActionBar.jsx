import React from "react";

export default function BulkActionBar({ onPurge }) {
  return <button onClick={onPurge}>Purge Expired Bookings</button>;
}
