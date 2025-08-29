// // App.js
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import AppointmentForm from './components/AppointmentForm';
// import AppointmentList from './components/AppointmentList';
// import Register from './components/Register';
// import Login from './components/Login';
// import { fetchAppointments, fetchAllAppointments } from './api/appointments'; // 👈 include admin fetch

// function App() {
//   // Load user from localStorage if available
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [appointments, setAppointments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       loadAppointments();
//     }
//   }, [user]);

//   // Normal user appointments
//   const loadAppointments = async () => {
//     try {
//       const response = await fetchAppointments();
//       setAppointments(response.data);
//     } catch (error) {
//       console.error('Failed to fetch appointments:', error);
//     }
//   };

//   // Admin: load ALL appointments
//   const loadAllAppointments = async () => {
//     try {
//       const response = await fetchAllAppointments();
//       setAppointments(response.data);
//     } catch (error) {
//       console.error('Failed to fetch all appointments (Admin):', error);
//     }
//   };

//   const handleAddAppointment = (newAppointment) => {
//     setAppointments((prev) => [...prev, newAppointment]);
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setAppointments([]);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="App">
//       <Routes>
//         {/* Redirect root to login */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         <Route
//           path="/login"
//           element={
//             user ? (
//               <Navigate to="/appointments" />
//             ) : (
//               <Login
//                 onLogin={(loggedInUser) => {
//                   setUser(loggedInUser);
//                   localStorage.setItem('user', JSON.stringify(loggedInUser)); // ✅ store role
//                   navigate('/appointments');
//                 }}
//               />
//             )
//           }
//         />

//         <Route
//           path="/register"
//           element={
//             user ? (
//               <Navigate to="/appointments" />
//             ) : (
//               <Register onSuccess={() => navigate('/login')} />
//             )
//           }
//         />

//         <Route
//           path="/appointments"
//           element={
//             user ? (
//               <div>
//                 <h1>
//                   Welcome, {user.name} ({user.role})
//                 </h1>
//                 <button onClick={handleLogout}>Logout</button>

//                 {/* Only admins see this button */}
//                 {user?.role === 'admin' && (
//                   <button onClick={loadAllAppointments} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded">
//                     View All Appointments (Admin)
//                   </button>
//                 )}

//                 <AppointmentForm onAdd={handleAddAppointment} />
//                 <AppointmentList appointments={appointments} />
//               </div>
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;

// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        {/* Redirect root to appropriate page */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          } 
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                onLogin={(loggedInUser) => {
                  setUser(loggedInUser);
                  localStorage.setItem('user', JSON.stringify(loggedInUser));
                  navigate('/dashboard');
                }}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register onSuccess={() => navigate('/login')} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Legacy route redirect for backwards compatibility */}
        <Route
          path="/appointments"
          element={<Navigate to="/dashboard" />}
        />
      </Routes>
    </div>
  );
}

export default App;