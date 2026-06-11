

// import { useEffect, useState } from "react";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { useToast } from "../context/ToastContext";

// const AdminAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();

//   const token = localStorage.getItem("token");

//   // ==============================
//   // Fetch ALL appointments (ADMIN)
//   // ==============================
//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(apiUrl("/api/appointments/all"), {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();
//       setAppointments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       addToast("Failed to load appointments", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // ==============================
//   // Update appointment status
//   // ==============================
//   const updateStatus = async (id, status) => {
//     if (!id) {
//       console.error("❌ Appointment ID missing");
//       return;
//     }

//     try {
//       const res = await fetch(apiUrl(`/api/appointments/${id}/status`), {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (!res.ok) throw new Error();

//       addToast(`Appointment ${status}`, "success");

//       // ✅ Optimistic UI update (Postgres-safe)
//       setAppointments((prev) =>
//         prev.map((a) =>
//           a.id === id ? { ...a, status } : a
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       addToast("Status update failed", "error");
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner text="Loading appointments..." />;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Manage Appointments</h1>

//       {appointments.length === 0 ? (
//         <p className="text-gray-500">No appointments found</p>
//       ) : (
//         <div className="bg-white shadow rounded-lg overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 text-left">Patient</th>
//                 <th className="p-3 text-left">Doctor</th>
//                 <th className="p-3 text-left">Date</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {appointments.map((appt) => (
//                 <tr key={appt.id} className="border-t">
//                   <td className="p-3">
//                     {appt.patient_name}
//                   </td>
//                   <td className="p-3">
//                     {appt.doctor_name}
//                   </td>
//                   <td className="p-3">
//                     {new Date(appt.date).toLocaleString()}
//                   </td>
//                   <td className="p-3 capitalize font-medium">
//                     {appt.status}
//                   </td>
//                   <td className="p-3 space-x-2">
//                     <button
//                       disabled={appt.status !== "pending"}
//                       onClick={() =>
//                         updateStatus(appt.id, "confirmed")
//                       }
//                       className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
//                     >
//                       Approve
//                     </button>

//                     <button
//                       disabled={appt.status === "cancelled"}
//                       onClick={() =>
//                         updateStatus(appt.id, "cancelled")
//                       }
//                       className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAppointments;


import { useEffect, useState, useCallback } from "react";
import { apiUrl } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const token = localStorage.getItem("token");

  // ==============================
  // Fetch ALL appointments (ADMIN)
  // ==============================
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(apiUrl("/api/appointments/all"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      addToast("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // ==============================
  // Update appointment status
  // ==============================
  const updateStatus = async (id, status) => {
    if (!id) {
      console.error("❌ Appointment ID missing");
      return;
    }

    try {
      const res = await fetch(apiUrl(`/api/appointments/${id}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      addToast(`Appointment ${status}`, "success");

      // Optimistic UI update
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error(err);
      addToast("Status update failed", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading appointments..." />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Manage Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No appointments found</p>
      ) : (
        <div className="health-card shadow-soft dark:shadow-soft-dark rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80">
              <tr>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Patient</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Doctor</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Date</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-t border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <td className="p-3">{appt.patient_name}</td>
                  <td className="p-3">{appt.doctor_name}</td>
                  <td className="p-3">
                    {new Date(appt.date).toLocaleString()}
                  </td>
                  <td className="p-3 capitalize font-medium">
                    {appt.status}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      disabled={appt.status !== "pending"}
                      onClick={() =>
                        updateStatus(appt.id, "confirmed")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      disabled={appt.status === "cancelled"}
                      onClick={() =>
                        updateStatus(appt.id, "cancelled")
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
