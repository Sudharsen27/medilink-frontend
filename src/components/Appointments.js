// // components/Appointments.js
// import React, { useState, useEffect } from 'react';
// import AppointmentForm from './AppointmentForm';
// import AppointmentList from './AppointmentList';

// const Appointments = ({ user }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/appointments', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setAppointments(data);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const handleCreateAppointment = () => {
//     setEditingAppointment(null);
//     setShowForm(true);
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingAppointment(null);
//     fetchAppointments();
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Appointments</h1>
//         <button 
//           onClick={handleCreateAppointment}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
//         >
//           Book New Appointment
//         </button>
//       </div>

//       {showForm && (
//         <AppointmentForm 
//           appointment={editingAppointment}
//           onClose={handleFormClose}
//           onSuccess={handleFormClose}
//         />
//       )}

//       <AppointmentList 
//         appointments={appointments}
//         onEdit={handleEditAppointment}
//         onDelete={fetchAppointments}
//       />
//     </div>
//   );
// };

// export default Appointments;

// // components/Appointments.js
// import React, { useState, useEffect } from 'react';
// import AppointmentForm from './AppointmentForm';
// import AppointmentList from './AppointmentList';
// import LoadingSpinner from './LoadingSpinner';

// const Appointments = ({ user }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // ✅ Fetch Appointments
//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/appointments', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch appointments');
//       const data = await response.json();
//       setAppointments(data);
//     } catch (err) {
//       console.error('Error fetching appointments:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Handlers
//   const handleCreateAppointment = () => {
//     setEditingAppointment(null);
//     setShowForm(true);
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingAppointment(null);
//     fetchAppointments();
//   };

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <div className="container mx-auto py-12 flex flex-col items-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
//         <LoadingSpinner text="Loading your appointments..." />
//       </div>
//     );
//   }

//   // ✅ Error State
//   if (error) {
//     return (
//       <div className="container mx-auto py-12 text-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
//           <p className="font-medium mb-2">Error: {error}</p>
//           <button
//             onClick={fetchAppointments}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Normal Render
//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
//           My Appointments
//         </h1>
//         <button
//           onClick={handleCreateAppointment}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
//         >
//           Book New Appointment
//         </button>
//       </div>

//       {showForm && (
//         <AppointmentForm
//           appointment={editingAppointment}
//           onClose={handleFormClose}
//           onSuccess={handleFormClose}
//         />
//       )}

//       <AppointmentList
//         appointments={appointments}
//         onEdit={handleEditAppointment}
//         onDelete={fetchAppointments}
//       />
//     </div>
//   );
// };

// export default Appointments;

// // components/Appointments.js
// import React, { useState, useEffect } from 'react';
// import { useToast } from '../context/ToastContext';
// import AppointmentForm from './AppointmentForm';
// import LoadingSpinner from './LoadingSpinner';
// import StatusBadge from './StatusBadge';
// import './Appointments.css';

// const Appointments = ({ user }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);

//   const { addToast } = useToast();

//   // derive statuses, ensuring 'all' first
//   const statuses = ['all', ...Array.from(new Set(appointments.map(apt => apt.status).filter(Boolean)))];

//   useEffect(() => {
//     fetchAppointments();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     applyFilter();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [appointments, statusFilter]);

//   // utility to get id (supports id or _id)
//   const getId = (apt) => apt.id ?? apt._id;

//   // Fetch appointments from API
//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
//       const res = await fetch('/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to fetch appointments');
//       const data = await res.json();
//       setAppointments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Error fetching appointments:', err);
//       setError(err.message || 'Failed to load appointments');
//       addToast('Failed to load appointments', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = () => {
//     if (statusFilter === 'all') {
//       setFilteredAppointments(appointments);
//     } else {
//       setFilteredAppointments(appointments.filter(a => a.status === statusFilter));
//     }
//   };

//   // Open form to create
//   const handleCreateAppointment = () => {
//     setEditingAppointment(null);
//     setShowForm(true);
//   };

//   // Open form to edit/view
//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//   };

//   const handleFormClose = (didChange) => {
//     // optionally refetch if something changed in the form
//     setShowForm(false);
//     setEditingAppointment(null);
//     if (didChange) fetchAppointments();
//   };

//   // Update appointment status (PATCH)
//   const handleStatusUpdate = async (appointmentId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error('Failed to update appointment');

//       setAppointments(prev => prev.map(apt =>
//         getId(apt).toString() === appointmentId.toString() ? { ...apt, status: newStatus } : apt
//       ));
//       addToast(`Appointment ${newStatus}`, 'success');
//     } catch (err) {
//       console.error('Error updating appointment:', err);
//       addToast('Failed to update appointment', 'error');
//     }
//   };

//   // Cancel (confirmation)
//   const cancelAppointment = (appointmentId) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       handleStatusUpdate(appointmentId, 'cancelled');
//     }
//   };

//   // Reschedule placeholder (could open modal/form)
//   const rescheduleAppointment = (appointmentId) => {
//     // Example: open same AppointmentForm prefilled (we call handleEdit)
//     const apt = appointments.find(a => getId(a).toString() === appointmentId.toString());
//     if (apt) {
//       setEditingAppointment(apt);
//       setShowForm(true);
//       addToast('Edit date/time to reschedule the appointment', 'info');
//     } else {
//       addToast('Appointment not found', 'error');
//     }
//   };

//   // Delete appointment (optional)
//   const deleteAppointment = async (appointmentId) => {
//     if (!window.confirm('Delete this appointment permanently?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error('Failed to delete appointment');
//       setAppointments(prev => prev.filter(a => getId(a).toString() !== appointmentId.toString()));
//       addToast('Appointment deleted', 'success');
//     } catch (err) {
//       console.error('Delete error:', err);
//       addToast('Failed to delete appointment', 'error');
//     }
//   };

//   // Loading UI
//   if (loading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
//         <LoadingSpinner text="Loading your appointments..." />
//       </div>
//     );
//   }

//   // Error UI
//   if (error) {
//     return (
//       <div className="container mx-auto py-12 text-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
//           <p className="font-medium mb-2">Error: {error}</p>
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={fetchAppointments}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => { setError(null); addToast('You can try creating a new appointment', 'info'); }}
//               className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">My Appointments</h1>
//           <p className="text-gray-600 dark:text-gray-400">Manage and track your medical appointments</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleCreateAppointment}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-colors"
//           >
//             Book New Appointment
//           </button>
//         </div>
//       </div>

//       {/* Form modal/inline */}
//       {showForm && (
//         <div className="mb-6">
//           <AppointmentForm
//             appointment={editingAppointment}
//             onClose={() => handleFormClose(false)}
//             onSuccess={() => handleFormClose(true)}
//           />
//         </div>
//       )}

//       {/* Filter card */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
//           >
//             <option value="all">All Appointments</option>
//             {statuses.filter(s => s !== 'all').map(status => (
//               <option key={status} value={status}>
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//               </option>
//             ))}
//           </select>

//           <span className="text-sm text-gray-600 dark:text-gray-400">
//             Showing {filteredAppointments.length} of {appointments.length} appointments
//           </span>
//         </div>
//       </div>

//       {/* List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//           <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No appointments found</h3>
//           <p className="mt-1 text-gray-500 dark:text-gray-400">
//             {statusFilter === 'all'
//               ? "You don't have any appointments yet."
//               : `No ${statusFilter} appointments found.`}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <AppointmentCard
//               key={getId(appointment)}
//               appointment={appointment}
//               onCancel={() => cancelAppointment(getId(appointment))}
//               onReschedule={() => rescheduleAppointment(getId(appointment))}
//               onEdit={() => handleEditAppointment(appointment)}
//               onDelete={() => deleteAppointment(getId(appointment))}
//               onStatusChange={(newStatus) => handleStatusUpdate(getId(appointment), newStatus)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ----------------------
//    Appointment Card
//    ---------------------- */
// const AppointmentCard = ({ appointment, onCancel, onReschedule, onEdit, onDelete, onStatusChange }) => {
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatTime = (timeString) => {
//     try {
//       // handle either full datetime or time-only strings
//       if (timeString.includes('T')) {
//         return new Date(timeString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//       }
//       return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     } catch {
//       return timeString;
//     }
//   };

//   const canCancel = ['scheduled', 'confirmed', 'pending'].includes(appointment.status);
//   const canReschedule = ['scheduled', 'confirmed'].includes(appointment.status);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         {/* Left: Info */}
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center gap-4 mb-3">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               {appointment.doctorName || appointment.doctor || 'Doctor'}
//             </h3>
//             <StatusBadge status={appointment.status} size="medium" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <span>{formatDate(appointment.date)}</span>
//             </div>

//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>{formatTime(appointment.time)}</span>
//             </div>

//             <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//               </svg>
//               <span>{appointment.hospital || 'Medical Center'}</span>
//             </div>
//           </div>

//           {appointment.notes && (
//             <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
//               <strong>Notes:</strong> {appointment.notes}
//             </p>
//           )}
//         </div>

//         {/* Right: Actions */}
//         <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
//           {canCancel && (
//             <button
//               onClick={onCancel}
//               className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
//             >
//               Cancel
//             </button>
//           )}

//           {canReschedule && (
//             <button
//               onClick={onReschedule}
//               className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
//             >
//               Reschedule
//             </button>
//           )}

//           <button
//             onClick={onEdit}
//             className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             Edit / View
//           </button>

//           <button
//             onClick={onDelete}
//             className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//             title="Delete permanently"
//           >
//             Delete
//           </button>

//           {/* Quick status dropdown */}
//           <StatusDropdown current={appointment.status} onChange={onStatusChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------
//    Status dropdown
//    ---------------------- */
// const StatusDropdown = ({ current, onChange }) => {
//   const options = ['scheduled', 'confirmed', 'completed', 'cancelled', 'pending'];
//   return (
//     <select
//       value={current}
//       onChange={(e) => onChange(e.target.value)}
//       className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
//       title="Change status"
//     >
//       {options.map(opt => (
//         <option key={opt} value={opt}>
//           {opt.charAt(0).toUpperCase() + opt.slice(1)}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Appointments;

// // components/Appointments.js
// import React, { useState, useEffect } from 'react';
// import { useToast } from '../context/ToastContext';
// import AppointmentForm from './AppointmentForm';
// import LoadingSpinner from './LoadingSpinner';
// import StatusBadge from './StatusBadge';
// import './Appointments.css';

// const Appointments = ({ user }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);

//   const { addToast } = useToast();

//   // 🧩 Derive all available statuses dynamically
//   const statuses = ['all', ...Array.from(new Set(appointments.map(apt => apt.status).filter(Boolean)))];

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   useEffect(() => {
//     applyFilter();
//   }, [appointments, statusFilter]);

//   // ✅ Get ID helper (Postgres returns `id`, Mongo would return `_id`)
//   const getId = (apt) => apt.id ?? apt._id;

//   // ✅ Fetch Appointments
//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');

//       const res = await fetch('/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch appointments');
//       const data = await res.json();
//       setAppointments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Error fetching appointments:', err);
//       setError(err.message || 'Failed to load appointments');
//       addToast('Failed to load appointments', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Apply status filter
//   const applyFilter = () => {
//     if (statusFilter === 'all') {
//       setFilteredAppointments(appointments);
//     } else {
//       setFilteredAppointments(appointments.filter(a => a.status === statusFilter));
//     }
//   };

//   // ✅ Create or edit appointment
//   const handleCreateAppointment = () => {
//     setEditingAppointment(null);
//     setShowForm(true);
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//   };

//   const handleFormClose = (didChange) => {
//     setShowForm(false);
//     setEditingAppointment(null);
//     if (didChange) fetchAppointments();
//   };

//   // ✅ Update appointment status (PATCH /api/appointments/:id/status)
//   const handleStatusUpdate = async (appointmentId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) throw new Error('Failed to update appointment status');

//       setAppointments(prev =>
//         prev.map(apt =>
//           getId(apt).toString() === appointmentId.toString()
//             ? { ...apt, status: newStatus }
//             : apt
//         )
//       );
//       addToast(`Appointment ${newStatus}`, 'success');
//     } catch (err) {
//       console.error('Error updating appointment:', err);
//       addToast('Failed to update appointment', 'error');
//     }
//   };

//   // ✅ Cancel
//   const cancelAppointment = (appointmentId) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       handleStatusUpdate(appointmentId, 'cancelled');
//     }
//   };

//   // ✅ Reschedule (opens edit form)
//   const rescheduleAppointment = (appointmentId) => {
//     const apt = appointments.find(a => getId(a).toString() === appointmentId.toString());
//     if (apt) {
//       setEditingAppointment(apt);
//       setShowForm(true);
//       addToast('Edit date/time to reschedule the appointment', 'info');
//     } else {
//       addToast('Appointment not found', 'error');
//     }
//   };

//   // ✅ Delete appointment
//   const deleteAppointment = async (appointmentId) => {
//     if (!window.confirm('Delete this appointment permanently?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to delete appointment');

//       setAppointments(prev => prev.filter(a => getId(a).toString() !== appointmentId.toString()));
//       addToast('Appointment deleted', 'success');
//     } catch (err) {
//       console.error('Delete error:', err);
//       addToast('Failed to delete appointment', 'error');
//     }
//   };

//   // ✅ Loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
//         <LoadingSpinner text="Loading your appointments..." />
//       </div>
//     );
//   }

//   // ✅ Error state
//   if (error) {
//     return (
//       <div className="container mx-auto py-12 text-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
//           <p className="font-medium mb-2">Error: {error}</p>
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={fetchAppointments}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => {
//                 setError(null);
//                 addToast('You can try creating a new appointment', 'info');
//               }}
//               className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//             My Appointments
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage and track your medical appointments
//           </p>
//         </div>

//         <button
//           onClick={handleCreateAppointment}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-colors"
//         >
//           Book New Appointment
//         </button>
//       </div>

//       {/* Appointment Form */}
//       {showForm && (
//         <div className="mb-6">
//           <AppointmentForm
//             appointment={editingAppointment}
//             onClose={() => handleFormClose(false)}
//             onSuccess={() => handleFormClose(true)}
//           />
//         </div>
//       )}

//       {/* Filter */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Filter by status:
//           </label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
//           >
//             <option value="all">All Appointments</option>
//             {statuses
//               .filter((s) => s !== 'all')
//               .map((status) => (
//                 <option key={status} value={status}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//           </select>

//           <span className="text-sm text-gray-600 dark:text-gray-400">
//             Showing {filteredAppointments.length} of {appointments.length} appointments
//           </span>
//         </div>
//       </div>

//       {/* Appointment List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//           <svg
//             className="mx-auto h-12 w-12 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1}
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
//             No appointments found
//           </h3>
//           <p className="mt-1 text-gray-500 dark:text-gray-400">
//             {statusFilter === 'all'
//               ? "You don't have any appointments yet."
//               : `No ${statusFilter} appointments found.`}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <AppointmentCard
//               key={getId(appointment)}
//               appointment={appointment}
//               onCancel={() => cancelAppointment(getId(appointment))}
//               onReschedule={() => rescheduleAppointment(getId(appointment))}
//               onEdit={() => handleEditAppointment(appointment)}
//               onDelete={() => deleteAppointment(getId(appointment))}
//               onStatusChange={(newStatus) =>
//                 handleStatusUpdate(getId(appointment), newStatus)
//               }
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* --------------------------
//    Appointment Card Component
// --------------------------- */
// const AppointmentCard = ({
//   appointment,
//   onCancel,
//   onReschedule,
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) => {
//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//   const formatTime = (timeString) =>
//     new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });

//   const canCancel = ['scheduled', 'confirmed', 'pending'].includes(appointment.status);
//   const canReschedule = ['scheduled', 'confirmed'].includes(appointment.status);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         {/* Appointment Info */}
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center gap-4 mb-3">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               {appointment.doctorName || 'Doctor'}
//             </h3>
//             <StatusBadge status={appointment.status} size="medium" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             <p className="text-gray-600 dark:text-gray-400">
//               📅 {formatDate(appointment.date)}
//             </p>
//             <p className="text-gray-600 dark:text-gray-400">
//               ⏰ {formatTime(appointment.time)}
//             </p>
//             <p className="text-gray-600 dark:text-gray-400">
//               🏥 {appointment.hospital || 'Medical Center'}
//             </p>
//           </div>

//           {appointment.notes && (
//             <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
//               <strong>Notes:</strong> {appointment.notes}
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
//           {canCancel && (
//             <button
//               onClick={onCancel}
//               className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition"
//             >
//               Cancel
//             </button>
//           )}

//           {canReschedule && (
//             <button
//               onClick={onReschedule}
//               className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
//             >
//               Reschedule
//             </button>
//           )}

//           <button
//             onClick={onEdit}
//             className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//           >
//             Edit / View
//           </button>

//           <button
//             onClick={onDelete}
//             className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//           >
//             Delete
//           </button>

//           <StatusDropdown current={appointment.status} onChange={onStatusChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --------------------------
//    Status Dropdown Component
// --------------------------- */
// const StatusDropdown = ({ current, onChange }) => {
//   const options = ['pending', 'scheduled', 'confirmed', 'completed', 'cancelled'];

//   return (
//     <select
//       value={current}
//       onChange={(e) => onChange(e.target.value)}
//       className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
//       title="Change status"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt.charAt(0).toUpperCase() + opt.slice(1)}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Appointments;

// // components/Appointments.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { useToast } from '../context/ToastContext';
// import AppointmentForm from './AppointmentForm';
// import LoadingSpinner from './LoadingSpinner';
// import StatusBadge from './StatusBadge';
// import './Appointments.css';

// const Appointments = ({ user }) => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);

//   const { addToast } = useToast();

//   // 🧩 Derive all available statuses dynamically
//   const statuses = ['all', ...Array.from(new Set(appointments.map(apt => apt.status).filter(Boolean)))];

//   // ✅ Get ID helper (Postgres returns `id`, Mongo would return `_id`)
//   const getId = (apt) => apt.id ?? apt._id;

//   // ✅ Fetch Appointments (wrapped in useCallback)
//   const fetchAppointments = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');

//       const res = await fetch('/api/appointments', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to fetch appointments');
//       const data = await res.json();
//       setAppointments(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Error fetching appointments:', err);
//       setError(err.message || 'Failed to load appointments');
//       addToast('Failed to load appointments', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [addToast]);

//   // ✅ Apply status filter (wrapped in useCallback)
//   const applyFilter = useCallback(() => {
//     if (statusFilter === 'all') {
//       setFilteredAppointments(appointments);
//     } else {
//       setFilteredAppointments(appointments.filter(a => a.status === statusFilter));
//     }
//   }, [appointments, statusFilter]);

//   useEffect(() => {
//     fetchAppointments();
//   }, [fetchAppointments]);

//   useEffect(() => {
//     applyFilter();
//   }, [applyFilter]);

//   // ✅ Create or edit appointment
//   const handleCreateAppointment = () => {
//     setEditingAppointment(null);
//     setShowForm(true);
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//   };

//   const handleFormClose = (didChange) => {
//     setShowForm(false);
//     setEditingAppointment(null);
//     if (didChange) fetchAppointments();
//   };

//   // ✅ Update appointment status (PATCH /api/appointments/:id/status)
//   const handleStatusUpdate = async (appointmentId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) throw new Error('Failed to update appointment status');

//       setAppointments(prev =>
//         prev.map(apt =>
//           getId(apt).toString() === appointmentId.toString()
//             ? { ...apt, status: newStatus }
//             : apt
//         )
//       );
//       addToast(`Appointment ${newStatus}`, 'success');
//     } catch (err) {
//       console.error('Error updating appointment:', err);
//       addToast('Failed to update appointment', 'error');
//     }
//   };

//   // ✅ Cancel
//   const cancelAppointment = (appointmentId) => {
//     if (window.confirm('Are you sure you want to cancel this appointment?')) {
//       handleStatusUpdate(appointmentId, 'cancelled');
//     }
//   };

//   // ✅ Reschedule (opens edit form)
//   const rescheduleAppointment = (appointmentId) => {
//     const apt = appointments.find(a => getId(a).toString() === appointmentId.toString());
//     if (apt) {
//       setEditingAppointment(apt);
//       setShowForm(true);
//       addToast('Edit date/time to reschedule the appointment', 'info');
//     } else {
//       addToast('Appointment not found', 'error');
//     }
//   };

//   // ✅ Delete appointment
//   const deleteAppointment = async (appointmentId) => {
//     if (!window.confirm('Delete this appointment permanently?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`/api/appointments/${appointmentId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error('Failed to delete appointment');

//       setAppointments(prev => prev.filter(a => getId(a).toString() !== appointmentId.toString()));
//       addToast('Appointment deleted', 'success');
//     } catch (err) {
//       console.error('Delete error:', err);
//       addToast('Failed to delete appointment', 'error');
//     }
//   };

//   // ✅ Loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto py-8">
//         <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
//         <LoadingSpinner text="Loading your appointments..." />
//       </div>
//     );
//   }

//   // ✅ Error state
//   if (error) {
//     return (
//       <div className="container mx-auto py-12 text-center">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
//           <p className="font-medium mb-2">Error: {error}</p>
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={fetchAppointments}
//               className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => {
//                 setError(null);
//                 addToast('You can try creating a new appointment', 'info');
//               }}
//               className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//             My Appointments
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage and track your medical appointments
//           </p>
//         </div>

//         <button
//           onClick={handleCreateAppointment}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-colors"
//         >
//           Book New Appointment
//         </button>
//       </div>

//       {/* Appointment Form */}
//       {showForm && (
//         <div className="mb-6">
//           <AppointmentForm
//             appointment={editingAppointment}
//             onClose={() => handleFormClose(false)}
//             onSuccess={() => handleFormClose(true)}
//           />
//         </div>
//       )}

//       {/* Filter */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-wrap items-center gap-4">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Filter by status:
//           </label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
//           >
//             <option value="all">All Appointments</option>
//             {statuses
//               .filter((s) => s !== 'all')
//               .map((status) => (
//                 <option key={status} value={status}>
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//           </select>

//           <span className="text-sm text-gray-600 dark:text-gray-400">
//             Showing {filteredAppointments.length} of {appointments.length} appointments
//           </span>
//         </div>
//       </div>

//       {/* Appointment List */}
//       {filteredAppointments.length === 0 ? (
//         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//           <svg
//             className="mx-auto h-12 w-12 text-gray-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1}
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//           <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
//             No appointments found
//           </h3>
//           <p className="mt-1 text-gray-500 dark:text-gray-400">
//             {statusFilter === 'all'
//               ? "You don't have any appointments yet."
//               : `No ${statusFilter} appointments found.`}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <AppointmentCard
//               key={getId(appointment)}
//               appointment={appointment}
//               onCancel={() => cancelAppointment(getId(appointment))}
//               onReschedule={() => rescheduleAppointment(getId(appointment))}
//               onEdit={() => handleEditAppointment(appointment)}
//               onDelete={() => deleteAppointment(getId(appointment))}
//               onStatusChange={(newStatus) =>
//                 handleStatusUpdate(getId(appointment), newStatus)
//               }
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* --------------------------
//    Appointment Card Component
// --------------------------- */
// const AppointmentCard = ({
//   appointment,
//   onCancel,
//   onReschedule,
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) => {
//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });

//   const formatTime = (timeString) =>
//     new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });

//   const canCancel = ['scheduled', 'confirmed', 'pending'].includes(appointment.status);
//   const canReschedule = ['scheduled', 'confirmed'].includes(appointment.status);

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//         {/* Appointment Info */}
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center gap-4 mb-3">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               {appointment.doctorName || 'Doctor'}
//             </h3>
//             <StatusBadge status={appointment.status} size="medium" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
//             <p className="text-gray-600 dark:text-gray-400">
//               📅 {formatDate(appointment.date)}
//             </p>
//             <p className="text-gray-600 dark:text-gray-400">
//               ⏰ {formatTime(appointment.time)}
//             </p>
//             <p className="text-gray-600 dark:text-gray-400">
//               🏥 {appointment.hospital || 'Medical Center'}
//             </p>
//           </div>

//           {appointment.notes && (
//             <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
//               <strong>Notes:</strong> {appointment.notes}
//             </p>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
//           {canCancel && (
//             <button
//               onClick={onCancel}
//               className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition"
//             >
//               Cancel
//             </button>
//           )}

//           {canReschedule && (
//             <button
//               onClick={onReschedule}
//               className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
//             >
//               Reschedule
//             </button>
//           )}

//           <button
//             onClick={onEdit}
//             className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//           >
//             Edit / View
//           </button>

//           <button
//             onClick={onDelete}
//             className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//           >
//             Delete
//           </button>

//           <StatusDropdown current={appointment.status} onChange={onStatusChange} />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* --------------------------
//    Status Dropdown Component
// --------------------------- */
// const StatusDropdown = ({ current, onChange }) => {
//   const options = ['pending', 'scheduled', 'confirmed', 'completed', 'cancelled'];

//   return (
//     <select
//       value={current}
//       onChange={(e) => onChange(e.target.value)}
//       className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
//       title="Change status"
//     >
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt.charAt(0).toUpperCase() + opt.slice(1)}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default Appointments;

// src/components/Appointments.js
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import AppointmentForm from './AppointmentForm';
import LoadingSpinner from './LoadingSpinner';
import StatusBadge from './StatusBadge';
import ExportButton from './ExportButton'; // ✅ Added import
import './Appointments.css';

const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const { addToast } = useToast();

  // 🧩 Derive all available statuses dynamically
  const statuses = ['all', ...Array.from(new Set(appointments.map(apt => apt.status).filter(Boolean)))];

  // ✅ Get ID helper (Postgres returns `id`, Mongo would return `_id`)
  const getId = (apt) => apt.id ?? apt._id;

  // ✅ Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const res = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to load appointments');
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ✅ Apply filter
  const applyFilter = useCallback(() => {
    if (statusFilter === 'all') setFilteredAppointments(appointments);
    else setFilteredAppointments(appointments.filter(a => a.status === statusFilter));
  }, [appointments, statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  // ✅ Create / Edit handlers
  const handleCreateAppointment = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleFormClose = (didChange) => {
    setShowForm(false);
    setEditingAppointment(null);
    if (didChange) fetchAppointments();
  };

  // ✅ Update appointment status
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update appointment status');

      setAppointments(prev =>
        prev.map(apt =>
          getId(apt).toString() === appointmentId.toString()
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      addToast(`Appointment ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating appointment:', err);
      addToast('Failed to update appointment', 'error');
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      handleStatusUpdate(appointmentId, 'cancelled');
    }
  };

  // ✅ Reschedule appointment
  const rescheduleAppointment = (appointmentId) => {
    const apt = appointments.find(a => getId(a).toString() === appointmentId.toString());
    if (apt) {
      setEditingAppointment(apt);
      setShowForm(true);
      addToast('Edit date/time to reschedule the appointment', 'info');
    } else {
      addToast('Appointment not found', 'error');
    }
  };

  // ✅ Delete appointment
  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Delete this appointment permanently?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete appointment');

      setAppointments(prev => prev.filter(a => getId(a).toString() !== appointmentId.toString()));
      addToast('Appointment deleted', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      addToast('Failed to delete appointment', 'error');
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        <LoadingSpinner text="Loading your appointments..." />
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
          <p className="font-medium mb-2">Error: {error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchAppointments}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setError(null);
                addToast('You can try creating a new appointment', 'info');
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your medical appointments
          </p>
        </div>

        {/* ✅ Export + Book Buttons */}
        <div className="flex items-center gap-3">
          <ExportButton
            data={appointments}
            dataType="appointments"
            variant="outline"
            size="medium"
            showLabel={true}
          />
          <button
            onClick={handleCreateAppointment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-colors"
          >
            Book New Appointment
          </button>
        </div>
      </div>

      {/* Appointment Form */}
      {showForm && (
        <div className="mb-6">
          <AppointmentForm
            appointment={editingAppointment}
            onClose={() => handleFormClose(false)}
            onSuccess={() => handleFormClose(true)}
          />
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="all">All Appointments</option>
            {statuses
              .filter((s) => s !== 'all')
              .map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
          </select>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </span>
        </div>
      </div>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No appointments found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {statusFilter === 'all'
              ? "You don't have any appointments yet."
              : `No ${statusFilter} appointments found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={getId(appointment)}
              appointment={appointment}
              onCancel={() => cancelAppointment(getId(appointment))}
              onReschedule={() => rescheduleAppointment(getId(appointment))}
              onEdit={() => handleEditAppointment(appointment)}
              onDelete={() => deleteAppointment(getId(appointment))}
              onStatusChange={(newStatus) =>
                handleStatusUpdate(getId(appointment), newStatus)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* --------------------------
   Appointment Card Component
--------------------------- */
const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (timeString) =>
    new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const canCancel = ['scheduled', 'confirmed', 'pending'].includes(appointment.status);
  const canReschedule = ['scheduled', 'confirmed'].includes(appointment.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Appointment Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {appointment.doctorName || 'Doctor'}
            </h3>
            <StatusBadge status={appointment.status} size="medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <p className="text-gray-600 dark:text-gray-400">📅 {formatDate(appointment.date)}</p>
            <p className="text-gray-600 dark:text-gray-400">⏰ {formatTime(appointment.time)}</p>
            <p className="text-gray-600 dark:text-gray-400">
              🏥 {appointment.hospital || 'Medical Center'}
            </p>
          </div>

          {appointment.notes && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
          {canCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Cancel
            </button>
          )}

          {canReschedule && (
            <button
              onClick={onReschedule}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              Reschedule
            </button>
          )}

          <button
            onClick={onEdit}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Edit / View
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Delete
          </button>

          <StatusDropdown current={appointment.status} onChange={onStatusChange} />
        </div>
      </div>
    </div>
  );
};

/* --------------------------
   Status Dropdown Component
--------------------------- */
const StatusDropdown = ({ current, onChange }) => {
  const options = ['pending', 'scheduled', 'confirmed', 'completed', 'cancelled'];

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
      title="Change status"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default Appointments;
