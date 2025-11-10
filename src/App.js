// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // Components
// import Navbar from './components/Navbar';
// import Dashboard from './components/Dashboard';
// import Register from './components/Register';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Appointments from './components/Appointments';
// import MedicalRecords from './components/MedicalRecords';
// import Prescriptions from './components/Prescriptions';
// import Notifications from './components/Notifications';

// // Pages
// import TelemedicineList from './pages/TelemedicineList';
// import Telemedicine from './pages/Telemedicine';
// import { Doctors, DoctorProfile } from './pages/Doctors';

// // Context
// import { ToastProvider, useToast } from './context/ToastContext';

// // Custom Hook
// import useAutoLogout from './hooks/useAutoLogout';

// function App() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem('darkMode') === 'true'
//   );

//   const navigate = useNavigate();
//   const { addToast } = useToast();

//   // ✅ Sync user changes (profile updates, etc.)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUser = localStorage.getItem('user');
//       setUser(updatedUser ? JSON.parse(updatedUser) : null);
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // ✅ Handle dark mode toggle
//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) root.classList.add('dark');
//     else root.classList.remove('dark');
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   // ✅ Handle login
//   const handleLogin = (loggedInUser) => {
//     localStorage.setItem('user', JSON.stringify(loggedInUser));
//     setUser(loggedInUser);
//     addToast('Login successful!', 'success');
//     navigate('/dashboard');
//   };

//   // ✅ Logout function
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     addToast('Logged out successfully', 'info');
//     navigate('/login');
//   };

//   // ✅ Auto logout hook
//   useAutoLogout(user, handleLogout);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
//       {/* ✅ Navbar */}
//       {user && (
//         <Navbar
//           user={user}
//           onLogout={handleLogout}
//           darkMode={darkMode}
//           setDarkMode={setDarkMode}
//         />
//       )}

//       {/* ✅ Routes */}
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
//                 <Login onLogin={handleLogin} />
//               )
//             }
//           />

//           <Route
//             path="/register"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <Register onSuccess={() => navigate('/login')} />
//               )
//             }
//           />

//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
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

//           {/* Telemedicine */}
//           <Route
//             path="/telemedicine"
//             element={user ? <TelemedicineList user={user} /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/telemedicine/:appointmentId"
//             element={user ? <Telemedicine user={user} /> : <Navigate to="/login" />}
//           />

//           {/* Doctors */}
//           <Route
//             path="/doctors"
//             element={user ? <Doctors /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/doctors/:id"
//             element={user ? <DoctorProfile /> : <Navigate to="/login" />}
//           />

//           {/* Fallback */}
//           <Route
//             path="*"
//             element={<Navigate to={user ? '/dashboard' : '/login'} />}
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// // ✅ Wrap App with ToastProvider
// export default function AppWrapper() {
//   return (
//     <ToastProvider>
//       <App />
//     </ToastProvider>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// // Components
// import Navbar from './components/Navbar';
// import Dashboard from './components/Dashboard';
// import Register from './components/Register';
// import Login from './components/Login';
// import Profile from './components/Profile';
// import Appointments from './components/Appointments';
// import MedicalRecords from './components/MedicalRecords';
// import Prescriptions from './components/Prescriptions';
// import Notifications from './components/Notifications';

// // Pages
// import TelemedicineList from './pages/TelemedicineList';
// import Telemedicine from './pages/Telemedicine';
// import { Doctors, DoctorProfile } from './pages/Doctors'; // ✅ Correct import

// // Context
// import { ToastProvider, useToast } from './context/ToastContext';

// // Custom Hook
// import useAutoLogout from './hooks/useAutoLogout';

// function App() {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem('darkMode') === 'true'
//   );

//   const navigate = useNavigate();
//   const { addToast } = useToast();

//   // ✅ Sync user state with localStorage
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedUser = localStorage.getItem('user');
//       setUser(updatedUser ? JSON.parse(updatedUser) : null);
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // ✅ Dark mode toggle
//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) root.classList.add('dark');
//     else root.classList.remove('dark');
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   // ✅ Login handler
//   const handleLogin = (loggedInUser) => {
//     localStorage.setItem('user', JSON.stringify(loggedInUser));
//     setUser(loggedInUser);
//     addToast('Login successful!', 'success');
//     navigate('/dashboard');
//   };

//   // ✅ Logout handler
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     addToast('Logged out successfully', 'info');
//     navigate('/login');
//   };

//   // ✅ Auto logout
//   useAutoLogout(user, handleLogout);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
//       {/* ✅ Navbar */}
//       {user && (
//         <Navbar
//           user={user}
//           onLogout={handleLogout}
//           darkMode={darkMode}
//           setDarkMode={setDarkMode}
//         />
//       )}

//       {/* ✅ Routes */}
//       <div className={user ? 'pt-20 px-4' : 'px-4'}>
//         <Routes>
//           {/* Redirect root */}
//           <Route
//             path="/"
//             element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//           />

//           {/* Auth Routes */}
//           <Route
//             path="/login"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <Login onLogin={handleLogin} />
//               )
//             }
//           />

//           <Route
//             path="/register"
//             element={
//               user ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <Register onSuccess={() => navigate('/login')} />
//               )
//             }
//           />

//           {/* Protected Routes */}
//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={
//               user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />
//             }
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

//           {/* Telemedicine */}
//           <Route
//             path="/telemedicine"
//             element={user ? <TelemedicineList user={user} /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/telemedicine/:appointmentId"
//             element={user ? <Telemedicine user={user} /> : <Navigate to="/login" />}
//           />

//           {/* Doctors */}
//           <Route
//             path="/doctors"
//             element={user ? <Doctors /> : <Navigate to="/login" />}
//           />
//           <Route
//             path="/doctors/:id"
//             element={user ? <DoctorProfile /> : <Navigate to="/login" />}
//           />

//           {/* Fallback */}
//           <Route
//             path="*"
//             element={<Navigate to={user ? '/dashboard' : '/login'} />}
//           />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// // ✅ Wrap App in ToastProvider
// export default function AppWrapper() {
//   return (
//     <ToastProvider>
//       <App />
//     </ToastProvider>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Appointments from './components/Appointments';
import MedicalRecords from './components/MedicalRecords';
import Prescriptions from './components/Prescriptions';
import Notifications from './components/Notifications';

// Pages
import TelemedicineList from './pages/TelemedicineList';
import Telemedicine from './pages/Telemedicine';
import { Doctors, DoctorProfile } from './pages/Doctors'; // ✅ Correct import
import Favorites from './pages/Favorites';

// Context
import { ToastProvider, useToast } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Custom Hook
import useAutoLogout from './hooks/useAutoLogout';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  const navigate = useNavigate();
  const { addToast } = useToast();

  // Sync user state with localStorage (cross-tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Login handler
  const handleLogin = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    addToast('Login successful!', 'success');
    navigate('/dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  // Auto logout
  useAutoLogout(user, handleLogout);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* Navbar only shown when user is logged in */}
      {user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* Routes */}
      <div className={user ? 'pt-20 px-4' : 'px-4'}>
        <Routes>
          {/* Redirect root */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
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

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={
              user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />
            }
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

          {/* Telemedicine */}
          <Route
            path="/telemedicine"
            element={user ? <TelemedicineList user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/telemedicine/:appointmentId"
            element={user ? <Telemedicine user={user} /> : <Navigate to="/login" />}
          />

          {/* Doctors */}
          <Route
            path="/doctors"
            element={user ? <Doctors /> : <Navigate to="/login" />}
          />
          <Route
            path="/doctors/:id"
            element={user ? <DoctorProfile /> : <Navigate to="/login" />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user ? '/dashboard' : '/login'} />}
          />
          <Route
  path="/favorites"
  element={user ? <Favorites /> : <Navigate to="/login" />}
/>
        </Routes>
      </div>
    </div>
  );
}

// Wrap App with all Providers
export default function AppWrapper() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ToastProvider>
  );
}
