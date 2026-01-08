// import React, { useState } from "react";
// import { deleteAppointment, updateAppointmentStatus } from "../api/appointments";

// export default function AppointmentList({ appointments, onUpdate }) {
//   const [loadingId, setLoadingId] = useState(null);

//   const handleDelete = async (id) => {
//     try {
//       setLoadingId(id);
//       await deleteAppointment(id);
//       onUpdate(); // refresh list in parent (Dashboard)
//     } catch (err) {
//       console.error("Delete failed", err);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       setLoadingId(id);
//       await updateAppointmentStatus(id, status);
//       onUpdate(); // refresh list in parent
//     } catch (err) {
//       console.error("Status update failed", err);
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div>
//       <h3>All Appointments</h3>
//       <ul>
//         {appointments.map((app) => (
//           <li key={app.id} className="mb-2">
//             <span>
//               {app.name} - {app.email} -{" "}
//               {new Date(app.date).toLocaleDateString()} - {app.status}
//             </span>
//             <button
//               disabled={loadingId === app.id}
//               onClick={() => handleDelete(app.id)}
//               className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
//             >
//               Delete
//             </button>
//             <button
//               disabled={loadingId === app.id}
//               onClick={() => handleStatusChange(app.id, "confirmed")}
//               className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
//             >
//               Confirm
//             </button>
//             <button
//               disabled={loadingId === app.id}
//               onClick={() => handleStatusChange(app.id, "cancelled")}
//               className="ml-2 px-2 py-1 bg-gray-500 text-white rounded"
//             >
//               Cancel
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { deleteAppointment, updateAppointmentStatus } from "../api/appointments";

// const STATUS_CLASSES = {
//   pending: "bg-yellow-100 text-yellow-700",
//   confirmed: "bg-green-100 text-green-700",
//   completed: "bg-purple-100 text-purple-700",
//   cancelled: "bg-red-100 text-red-700",
// };

// export default function AppointmentList({ appointments, onUpdate }) {
//   const [loadingId, setLoadingId] = useState(null);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this appointment?")) return;

//     try {
//       setLoadingId(id);
//       await deleteAppointment(id);
//       onUpdate(); // refresh list in Dashboard
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete appointment");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       setLoadingId(id);
//       await updateAppointmentStatus(id, status);
//       onUpdate(); // refresh list in Dashboard
//     } catch (err) {
//       console.error("Status update failed", err);
//       alert("Failed to update status");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   // EMPTY STATE
//   if (!appointments || appointments.length === 0) {
//     return (
//       <div className="py-12 text-center text-gray-500">
//         📭 No appointments found
//         <p className="text-sm mt-1">
//           Try adjusting filters or creating a new appointment
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <h3 className="text-lg font-semibold mb-4">All Appointments</h3>

//       {/* TABLE HEADER */}
//       <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 rounded-t">
//         <div>Patient</div>
//         <div>Email</div>
//         <div>Date</div>
//         <div>Status</div>
//         <div className="col-span-2 text-center">Actions</div>
//       </div>

//       {/* TABLE ROWS */}
//       {appointments.map((app) => (
//         <div
//           key={app.id}
//           className={`grid grid-cols-6 gap-4 px-4 py-3 border-b items-center hover:bg-gray-50 transition
//             ${app.status === "cancelled" ? "opacity-60" : ""}
//           `}
//         >
//           {/* Patient */}
//           <div className="font-medium">{app.name}</div>

//           {/* Email */}
//           <div className="text-sm text-gray-600 truncate">{app.email}</div>

//           {/* Date */}
//           <div className="text-sm">
//             {new Date(app.date).toLocaleDateString()}
//           </div>

//           {/* STATUS DROPDOWN */}
//           <div>
//             <select
//               disabled={loadingId === app.id}
//               value={app.status}
//               onChange={(e) =>
//                 handleStatusChange(app.id, e.target.value)
//               }
//               className={`text-xs px-2 py-1 rounded border cursor-pointer ${STATUS_CLASSES[app.status]}`}
//             >
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="col-span-2 flex gap-2 justify-center">
//             <button
//               disabled={loadingId === app.id}
//               onClick={() => handleStatusChange(app.id, "confirmed")}
//               className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//             >
//               Confirm
//             </button>

//             <button
//               disabled={loadingId === app.id}
//               onClick={() => handleDelete(app.id)}
//               className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState } from "react";
import {
  deleteAppointment,
  updateAppointmentStatus,
  updateAppointment, // ✅ RESCHEDULE API
} from "../api/appointments";

const STATUS_CLASSES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AppointmentList({ appointments, onUpdate }) {
  const [loadingId, setLoadingId] = useState(null);

  // 🔁 Reschedule state
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      setLoadingId(id);
      await deleteAppointment(id);
      onUpdate();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete appointment");
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setLoadingId(id);
      await updateAppointmentStatus(id, status);
      onUpdate();
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔁 RESCHEDULE HANDLER
  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoadingId(selectedApp.id);

      await updateAppointment(selectedApp.id, {
        date: newDate,
        time: newTime,
      });

      setShowReschedule(false);
      setSelectedApp(null);
      onUpdate();
    } catch (err) {
      console.error("Reschedule failed", err);
      alert("Failed to reschedule appointment");
    } finally {
      setLoadingId(null);
    }
  };

  // EMPTY STATE
  if (!appointments || appointments.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        📭 No appointments found
        <p className="text-sm mt-1">
          Try adjusting filters or creating a new appointment
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">All Appointments</h3>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 rounded-t">
        <div>Patient</div>
        <div>Email</div>
        <div>Date</div>
        <div>Status</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* TABLE ROWS */}
      {appointments.map((app) => (
        <div
          key={app.id}
          className={`grid grid-cols-6 gap-4 px-4 py-3 border-b items-center hover:bg-gray-50 transition
            ${app.status === "cancelled" ? "opacity-60" : ""}
          `}
        >
          {/* Patient */}
          <div className="font-medium">{app.name}</div>

          {/* Email */}
          <div className="text-sm text-gray-600 truncate">{app.email}</div>

          {/* Date */}
          <div className="text-sm">
            {new Date(app.date).toLocaleDateString()}
          </div>

          {/* STATUS DROPDOWN */}
          <div>
            <select
              disabled={loadingId === app.id}
              value={app.status}
              onChange={(e) =>
                handleStatusChange(app.id, e.target.value)
              }
              className={`text-xs px-2 py-1 rounded border cursor-pointer ${STATUS_CLASSES[app.status]}`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="col-span-2 flex gap-2 justify-center">
            <button
              disabled={loadingId === app.id}
              onClick={() => handleStatusChange(app.id, "confirmed")}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Confirm
            </button>

            <button
              disabled={loadingId === app.id}
              onClick={() => {
                setSelectedApp(app);
                setNewDate(app.date.split("T")[0]);
                setNewTime(app.time);
                setShowReschedule(true);
              }}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Reschedule
            </button>

            <button
              disabled={loadingId === app.id}
              onClick={() => handleDelete(app.id)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* 🔁 RESCHEDULE MODAL */}
      {showReschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Reschedule Appointment
            </h3>

            <label className="block mb-2 text-sm">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-2 text-sm">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReschedule(false)}
                className="px-3 py-1 text-sm bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
