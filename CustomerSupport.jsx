import React, { useState } from "react";

export default function CustomerSupport() {
  const [message, setMessage] = useState(
    "Hi! I can help with space availability, bookings, and maintenance."
  );

  return (
    <div className="support-panel">
      <h2>DeskFlow Support</h2>
      <div className="chat-bubble">
        <p>{message}</p>
      </div>
      <div className="chat-actions">
        <button
          type="button"
          onClick={() => setMessage("I can check availability, create a booking, or explain outage/maintenance status.")}
        >
          Ask support
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setMessage("A human support agent has been requested. Please hold while we connect you.")}
        >
          Connect to human agent
        </button>
      </div>
    </div>
  );
}
