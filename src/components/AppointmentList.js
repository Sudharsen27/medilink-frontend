import React, { useState } from "react";
import { deleteAppointment, updateAppointmentStatus } from "../api/appointments";

export default function AppointmentList({ appointments, onUpdate }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await deleteAppointment(id);
      onUpdate(); // refresh list in parent (Dashboard)
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setLoadingId(id);
      await updateAppointmentStatus(id, status);
      onUpdate(); // refresh list in parent
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h3>All Appointments</h3>
      <ul>
        {appointments.map((app) => (
          <li key={app.id} className="mb-2">
            <span>
              {app.name} - {app.email} -{" "}
              {new Date(app.date).toLocaleDateString()} - {app.status}
            </span>
            <button
              disabled={loadingId === app.id}
              onClick={() => handleDelete(app.id)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
            <button
              disabled={loadingId === app.id}
              onClick={() => handleStatusChange(app.id, "confirmed")}
              className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
            >
              Confirm
            </button>
            <button
              disabled={loadingId === app.id}
              onClick={() => handleStatusChange(app.id, "cancelled")}
              className="ml-2 px-2 py-1 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
