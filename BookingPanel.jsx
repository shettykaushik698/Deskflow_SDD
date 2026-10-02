import React, { useMemo, useState } from "react";

export default function BookingPanel({ spaces, onBook }) {
  const defaultSpaceId = useMemo(() => spaces[0]?.id || "", [spaces]);
  const [form, setForm] = useState({
    space_id: defaultSpaceId,
    reserved_by: "Guest",
    guest_count: 1,
    start_time: "",
    end_time: "",
    amenities: "",
  });

  React.useEffect(() => {
    if (defaultSpaceId && !form.space_id) {
      setForm((prev) => ({ ...prev, space_id: defaultSpaceId }));
    }
  }, [defaultSpaceId, form.space_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.space_id || !form.start_time || !form.end_time || !form.reserved_by) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      space_id: form.space_id,
      reserved_by: form.reserved_by,
      guest_count: Number(form.guest_count) || 1,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    await onBook(payload);
    setForm((prev) => ({
      ...prev,
      reserved_by: "Guest",
      guest_count: 1,
      start_time: "",
      end_time: "",
      amenities: "",
    }));
  };

  return (
    <div className="panel booking-panel">
      <h2>Book a space</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Space
          <select name="space_id" value={form.space_id} onChange={handleChange}>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.code} ({space.type})
              </option>
            ))}
          </select>
        </label>

        <label>
          Reserved by
          <input
            type="text"
            name="reserved_by"
            value={form.reserved_by}
            onChange={handleChange}
            placeholder="Employee or guest name"
          />
        </label>

        <div className="inline-fields">
          <label>
            Start
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
            />
          </label>

          <label>
            End
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="inline-fields">
          <label>
            Guest count
            <input
              type="number"
              min="1"
              name="guest_count"
              value={form.guest_count}
              onChange={handleChange}
            />
          </label>

          <label>
            Amenities
            <input
              type="text"
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              placeholder="monitor, whiteboard"
            />
          </label>
        </div>

        <button type="submit">Create Reservation</button>
      </form>
    </div>
  );
}
