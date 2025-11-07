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

// components/Appointments.js
import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import LoadingSpinner from './LoadingSpinner';

const Appointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Fetch Appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handlers
  const handleCreateAppointment = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAppointment(null);
    fetchAppointments();
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
        <LoadingSpinner text="Loading your appointments..." />
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
          <p className="font-medium mb-2">Error: {error}</p>
          <button
            onClick={fetchAppointments}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Normal Render
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          My Appointments
        </h1>
        <button
          onClick={handleCreateAppointment}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
        >
          Book New Appointment
        </button>
      </div>

      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      <AppointmentList
        appointments={appointments}
        onEdit={handleEditAppointment}
        onDelete={fetchAppointments}
      />
    </div>
  );
};

export default Appointments;
