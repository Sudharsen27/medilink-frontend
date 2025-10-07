// // App.js
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import Register from './components/Register';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Appointments from './components/Appointments';
// import Navbar from './components/Navbar';
// import DarkModeToggle from './components/DarkModeToggle';
// import { Doctors, DoctorProfile } from './pages/Doctors'; // ✅ only named imports

// function App() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem('darkMode') === 'true'
//   );

//   const navigate = useNavigate();

//   // Apply dark mode class on html
//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (darkMode) {
//       root.classList.add('dark');
//     } else {
//       root.classList.remove('dark');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
//       {/* Navbar + Dark Mode Toggle */}
//       {user && (
//         <div className="fixed w-full z-50">
//           <Navbar user={user} onLogout={handleLogout} />
//           <div className="absolute top-4 right-4">
//             <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={user ? 'pt-20 px-4' : 'px-4'}>
//         <Routes>
//           <Route
//             path="/"
//             element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/login"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <Login
//                   onLogin={(loggedInUser) => {
//                     setUser(loggedInUser);
//                     localStorage.setItem('user', JSON.stringify(loggedInUser));
//                     navigate('/dashboard');
//                   }}
//                 />
//               )
//             }
//           />

//           <Route
//             path="/register"
//             element={
//               user ? <Navigate to="/dashboard" /> : <Register onSuccess={() => navigate('/login')} />
//             }
//           />

//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={user ? <Profile user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/appointments"
//             element={user ? <Appointments user={user} /> : <Navigate to="/login" />}
//           />

//           {/* Doctors list and profile */}
//           <Route path="/doctors" element={user ? <Doctors /> : <Navigate to="/login" />} />
//           <Route path="/doctors/:id" element={<DoctorProfile />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

// App.js
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Dashboard from './components/Dashboard';
// import Register from './components/Register';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Appointments from './components/Appointments';
// import MedicalRecords from './components/MedicalRecords';
// import Prescriptions from './components/Prescriptions';
// import Notifications from './components/Notifications';
// import Telemedicine from './pages/Telemedicine';
// import Navbar from './components/Navbar';
// import DarkModeToggle from './components/DarkModeToggle';
// import { Doctors, DoctorProfile } from './pages/Doctors';

// function App() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem('darkMode') === 'true'
//   );

//   const navigate = useNavigate();

//   // Apply dark mode class on html
//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (darkMode) {
//       root.classList.add('dark');
//     } else {
//       root.classList.remove('dark');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
//       {/* Navbar + Dark Mode Toggle */}
//       {user && (
//         <div className="fixed w-full z-50">
//           <Navbar user={user} onLogout={handleLogout} />
//           <div className="absolute top-4 right-4">
//             <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={user ? 'pt-20 px-4' : 'px-4'}>
//         <Routes>
//           <Route
//             path="/"
//             element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/login"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <Login
//                   onLogin={(loggedInUser) => {
//                     setUser(loggedInUser);
//                     localStorage.setItem('user', JSON.stringify(loggedInUser));
//                     navigate('/dashboard');
//                   }}
//                 />
//               )
//             }
//           />

//           <Route
//             path="/register"
//             element={
//               user ? <Navigate to="/dashboard" /> : <Register onSuccess={() => navigate('/login')} />
//             }
//           />

//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={user ? <Profile user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/appointments"
//             element={user ? <Appointments user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/medical-records"
//             element={user ? <MedicalRecords user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/prescriptions"
//             element={user ? <Prescriptions user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/notifications"
//             element={user ? <Notifications user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/telemedicine/:appointmentId"
//             element={user ? <Telemedicine user={user} /> : <Navigate to="/login" />}
//           />

//           {/* Doctors list and profile */}
//           <Route path="/doctors" element={user ? <Doctors /> : <Navigate to="/login" />} />
//           <Route path="/doctors/:id" element={user ? <DoctorProfile /> : <Navigate to="/login" />} />

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Appointments from './components/Appointments';
import MedicalRecords from './components/MedicalRecords';
import Prescriptions from './components/Prescriptions';
import Notifications from './components/Notifications';
import TelemedicineList from './pages/TelemedicineList'; // ADD THIS IMPORT
import Telemedicine from './pages/Telemedicine';
import Navbar from './components/Navbar';
import DarkModeToggle from './components/DarkModeToggle';
import { Doctors, DoctorProfile } from './pages/Doctors';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  const navigate = useNavigate();

  // Apply dark mode class on html
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* Navbar + Dark Mode Toggle */}
      {user && (
        <div className="fixed w-full z-50">
          <Navbar user={user} onLogout={handleLogout} />
          <div className="absolute top-4 right-4">
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={user ? 'pt-20 px-4' : 'px-4'}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
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
              user ? <Navigate to="/dashboard" /> : <Register onSuccess={() => navigate('/login')} />
            }
          />

          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/appointments"
            element={user ? <Appointments user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/medical-records"
            element={user ? <MedicalRecords user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/prescriptions"
            element={user ? <Prescriptions user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/notifications"
            element={user ? <Notifications user={user} /> : <Navigate to="/login" />}
          />

          {/* ADD THIS ROUTE - Telemedicine List Page */}
          <Route
            path="/telemedicine"
            element={user ? <TelemedicineList user={user} /> : <Navigate to="/login" />}
          />

          {/* Telemedicine Video Call Page */}
          <Route
            path="/telemedicine/:appointmentId"
            element={user ? <Telemedicine user={user} /> : <Navigate to="/login" />}
          />

          {/* Doctors list and profile */}
          <Route path="/doctors" element={user ? <Doctors /> : <Navigate to="/login" />} />
          <Route path="/doctors/:id" element={user ? <DoctorProfile /> : <Navigate to="/login" />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;