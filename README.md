# DeskFlow

## Required setup

0. If Python venv support is missing on Ubuntu/Debian, install it first:
   ```bash
   sudo apt update
   sudo apt install -y python3-venv
   ```

1. Create and activate a Python virtual environment:
   ```bash
   cd /home/labuser/Downloads/Deskflow_SDD
   python3 -m venv .venv
   . .venv/bin/activate
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend API:
   ```bash
   uvicorn main:app --reload
   ```

4. In a second terminal, install frontend dependencies:
   ```bash
   cd /home/labuser/Downloads/Deskflow_SDD
   npm install
   ```

5. Start the frontend app:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```

---
Backend API: http://localhost:8000
Frontend UI: http://localhost:5173

If port 5173 is already in use, Vite may automatically switch to another port such as 5174. Open the port printed by Vite in the terminal.
Open the frontend URL in the browser to see the DeskFlow dashboard.
If you open the backend URL directly, you will see JSON output from the API instead of the UI.

## How to use the app

1. Open the frontend URL shown by Vite (usually http://localhost:5173).
2. On the dashboard, review the space list and current reservation summary cards.
3. To create a booking:
   - select a desk or room from the space grid or booking form,
   - choose the guest name,
   - choose the start and end times,
   - click the booking action to save the reservation.
4. To mark a space as unavailable:
   - use the maintenance toggle on that space card.
5. To handle a walk-up desk request:
   - click the walk-up action for a space,
   - the app will create a quick booking for that desk.
6. To change an existing booking:
   - open the reservation row,
   - update the date/time or move it to another space,
   - click Reschedule or Reassign.
7. To remove a reservation:
   - click Cancel in that reservation row.
8. To review customer support actions or purge expired bookings, use the support panel and bulk action bar.

### Quick product walkthrough

- The left side of the dashboard shows available spaces.
- The booking form creates new reservations.
- The reservation table lists current bookings and allows edits.
- Summary cards keep track of total spaces and active bookings.

This is a quick text version of a walkthrough video: open the app, add a booking, adjust a reservation, toggle maintenance, and review the updated dashboard.
