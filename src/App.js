


// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// // Components
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Profile from "./components/Profile";
// import Appointments from "./components/Appointments";
// import MedicalRecords from "./components/MedicalRecords";
// import Prescriptions from "./components/Prescriptions";
// import Notifications from "./components/Notifications";

// // Pages / Patient profile component (separate page)
// import TelemedicineList from "./pages/TelemedicineList";
// import Telemedicine from "./pages/Telemedicine";
// import { Doctors, DoctorProfile } from "./pages/Doctors";
// import Favorites from "./pages/Favorites";
// import PatientProfile from "./components/PatientProfile"; // <-- new patient profile page
// import PatientManagement from './components/PatientManagement';

// // Context Providers
// import { ToastProvider, useToast } from "./context/ToastContext";
// import { FavoritesProvider } from "./context/FavoritesContext";
// import { ActivityProvider } from "./context/ActivityContext";
// import { MedicalRecordsProvider } from "./context/MedicalRecordsContext";
// import { SearchProvider } from "./context/SearchContext";
// import { PrescriptionsProvider } from "./context/PrescriptionsContext";
// import { PatientProfileProvider } from "./context/PatientProfileContext";
// import { DashboardProvider } from "./context/DashboardContext";
// import { EnhancedNotificationsProvider } from "./context/EnhancedNotificationsContext";

// // Hooks
// import useAutoLogout from "./hooks/useAutoLogout";
// // Auth

// // ------------------------------------------------------------
// // MAIN APP
// // ------------------------------------------------------------
// function App() {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem("darkMode") === "true"
//   );

//   const { addToast } = useToast();
//   const navigate = useNavigate();

//   // Sync user across tabs
//   useEffect(() => {
//     const handleStorage = () => {
//       const updated = localStorage.getItem("user");
//       setUser(updated ? JSON.parse(updated) : null);
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   // Dark mode toggle
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   // Login
//   const handleLogin = (loggedInUser) => {
//     localStorage.setItem("user", JSON.stringify(loggedInUser));
//     setUser(loggedInUser);
//     addToast("Login successful!", "success");
//     navigate("/dashboard");
//   };

//   // Logout
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     addToast("Logged out successfully", "info");
//     navigate("/login");
//   };

//   // Auto Logout
//   useAutoLogout(user, handleLogout);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition">
//       {user && (
//         <Navbar
//           user={user}
//           onLogout={handleLogout}
//           darkMode={darkMode}
//           setDarkMode={setDarkMode}
//         />
//       )}

//       <div className={user ? "pt-20 px-4" : "px-4"}>
//         <Routes>
//           {/* Default */}
//           <Route
//             path="/"
//             element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//           />

//           {/* AUTH ROUTES */}
//           <Route
//             path="/login"
//             element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
//           />

//           <Route
//             path="/register"
//             element={
//               user
//                 ? <Navigate to="/dashboard" />
//                 : <Register onSuccess={() => navigate("/login")} />
//             }
//           />

//           {/* PROTECTED ROUTES */}
//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
//           />

//           {/* Separate patient profile data page (uses PatientProfileContext) */}
//           <Route
//             path="/patient-profile"
//             element={user ? <PatientProfile /> : <Navigate to="/login" />}
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

//           {/* Favorites */}
//           <Route
//             path="/favorites"
//             element={user ? <Favorites /> : <Navigate to="/login" />}
//           />

//           {/* Fallback */}
//           <Route
//             path="*"
//             element={<Navigate to={user ? "/dashboard" : "/login"} />}
//           />
//           <Route path="/patients" element={user ? <PatientManagement /> : <Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------
// // PROVIDER WRAPPER (CORRECT ORDER)
// // ------------------------------------------------------------
// export default function AppWrapper() {
//   return (
//     <ToastProvider>
//       <FavoritesProvider>
//         <ActivityProvider>
//           <EnhancedNotificationsProvider>
//             <PrescriptionsProvider>
//               <MedicalRecordsProvider>
//                 <DashboardProvider>
//                   <SearchProvider>
//                     <PatientProfileProvider>
//                       <App />
//                     </PatientProfileProvider>
//                   </SearchProvider>
//                 </DashboardProvider>
//               </MedicalRecordsProvider>
//             </PrescriptionsProvider>
//           </EnhancedNotificationsProvider>
//         </ActivityProvider>
//       </FavoritesProvider>
//     </ToastProvider>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// // Components
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Profile from "./components/Profile";
// import Appointments from "./components/Appointments";
// import MedicalRecords from "./components/MedicalRecords";
// import Prescriptions from "./components/Prescriptions";
// import Notifications from "./components/Notifications";
// import PatientProfile from "./components/PatientProfile";
// import PatientManagement from "./components/PatientManagement";

// // Pages
// import TelemedicineList from "./pages/TelemedicineList";
// import Telemedicine from "./pages/Telemedicine";
// import { Doctors, DoctorProfile } from "./pages/Doctors";
// import Favorites from "./pages/Favorites";
// import EmergencyDashboard from './components/EmergencyDashboard';
// import Caregivers from "./pages/Caregivers";


// // Context Providers
// import { ToastProvider, useToast } from "./context/ToastContext";
// import { FavoritesProvider } from "./context/FavoritesContext";
// import { ActivityProvider } from "./context/ActivityContext";
// import { MedicalRecordsProvider } from "./context/MedicalRecordsContext";
// import { SearchProvider } from "./context/SearchContext";
// import { PrescriptionsProvider } from "./context/PrescriptionsContext";
// import { PatientProfileProvider } from "./context/PatientProfileContext";
// import { DashboardProvider } from "./context/DashboardContext";
// import { EnhancedNotificationsProvider } from "./context/EnhancedNotificationsContext";
// import { EmergencyProvider } from "./context/EmergencyContext";
// import { CaregiverProvider } from "./context/CaregiverContext";

// // Hooks
// import useAutoLogout from "./hooks/useAutoLogout";

// // ------------------------------------------------------------
// // MAIN APP
// // ------------------------------------------------------------
// function App() {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [darkMode, setDarkMode] = useState(
//     () => localStorage.getItem("darkMode") === "true"
//   );

//   const { addToast } = useToast();
//   const navigate = useNavigate();

//   // Sync user across tabs
//   useEffect(() => {
//     const handleStorage = () => {
//       const updated = localStorage.getItem("user");
//       setUser(updated ? JSON.parse(updated) : null);
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   // Dark mode
//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   // Login
//   const handleLogin = (loggedInUser) => {
//     localStorage.setItem("user", JSON.stringify(loggedInUser));
//     setUser(loggedInUser);
//     addToast("Login successful!", "success");
//     navigate("/dashboard");
//   };

//   // Logout
//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     addToast("Logged out successfully", "info");
//     navigate("/login");
//   };

//   // Auto logout
//   useAutoLogout(user, handleLogout);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition">
//       {user && (
//         <Navbar
//           user={user}
//           onLogout={handleLogout}
//           darkMode={darkMode}
//           setDarkMode={setDarkMode}
//         />
//       )}

//       <div className={user ? "pt-20 px-4" : "px-4"}>
//         <Routes>
//           {/* Default */}
//           <Route
//             path="/"
//             element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//           />

//           {/* Auth */}
//           <Route
//             path="/login"
//             element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
//           />

//           {/* <Route
//             path="/register"
//             element={user ? <Navigate to="/dashboard" /> : <Register />}
//           /> */}
//           <Route
//   path="/register"
//   element={
//     user ? (
//       <Navigate to="/dashboard" />
//     ) : (
//       <Register onSuccess={() => navigate("/login")} />
//     )
//   }
// />


//           {/* Protected */}
//           <Route
//             path="/dashboard"
//             element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/profile"
//             element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/patient-profile"
//             element={user ? <PatientProfile /> : <Navigate to="/login" />}
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

//           {/* Favorites */}
//           <Route
//             path="/favorites"
//             element={user ? <Favorites /> : <Navigate to="/login" />}
//           />

//           {/* Emergency ✅ */}
//           <Route
//             path="/emergency"
//             element={user ? <EmergencyDashboard user={user} /> : <Navigate to="/login" />}
//           />

//           {/* Patients */}
//           <Route
//             path="/patients"
//             element={user ? <PatientManagement /> : <Navigate to="/login" />}
//           />

//           {/* Fallback */}
//           <Route
//             path="*"
//             element={<Navigate to={user ? "/dashboard" : "/login"} />}
//           />
//           <Route
//   path="/caregivers"
//   element={user ? <Caregivers /> : <Navigate to="/login" />}
// />

//         </Routes>
//       </div>
//     </div>
//   );
// }

// // ------------------------------------------------------------
// // PROVIDER WRAPPER (FINAL + CORRECT)
// // ------------------------------------------------------------
// export default function AppWrapper() {
//   return (
//     <ToastProvider>
//       <FavoritesProvider>
//         <ActivityProvider>
//           <EnhancedNotificationsProvider>
//             <PrescriptionsProvider>
//               <MedicalRecordsProvider>
//                 <DashboardProvider>
//                   <SearchProvider>
//                     <PatientProfileProvider>
//                       <EmergencyProvider>
//                         <CaregiverProvider> 
//                         <App />
//                         </CaregiverProvider>
//                       </EmergencyProvider>
//                     </PatientProfileProvider>
//                   </SearchProvider>
//                 </DashboardProvider>
//               </MedicalRecordsProvider>
//             </PrescriptionsProvider>
//           </EnhancedNotificationsProvider>
//         </ActivityProvider>
//       </FavoritesProvider>
//     </ToastProvider>
//   );
// }


import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Appointments from "./components/Appointments";
import MedicalRecords from "./components/MedicalRecords";
import Prescriptions from "./components/Prescriptions";
import Notifications from "./components/Notifications";
import PatientProfile from "./components/PatientProfile";
import PatientManagement from "./components/PatientManagement";
import EmergencyDashboard from "./components/EmergencyDashboard";

// Pages
import TelemedicineList from "./pages/TelemedicineList";
import Telemedicine from "./pages/Telemedicine";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Favorites from "./pages/Favorites";
import Caregivers from "./pages/Caregivers";
import BookAppointment from "./pages/BookAppointment";

// Context Providers
import { ToastProvider, useToast } from "./context/ToastContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ActivityProvider } from "./context/ActivityContext";
import { MedicalRecordsProvider } from "./context/MedicalRecordsContext";
import { SearchProvider } from "./context/SearchContext";
import { PrescriptionsProvider } from "./context/PrescriptionsContext";
import { PatientProfileProvider } from "./context/PatientProfileContext";
import { DashboardProvider } from "./context/DashboardContext";
import { EnhancedNotificationsProvider } from "./context/EnhancedNotificationsContext";
import { EmergencyProvider } from "./context/EmergencyContext";
import { CaregiverProvider } from "./context/CaregiverContext";

// Hooks
import useAutoLogout from "./hooks/useAutoLogout";

// ------------------------------------------------------------
// MAIN APP
// ------------------------------------------------------------
function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const { addToast } = useToast();
  const navigate = useNavigate();

  // Sync user across tabs
  useEffect(() => {
    const handleStorage = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Login
  const handleLogin = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    addToast("Login successful!", "success");
    navigate("/dashboard");
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    addToast("Logged out successfully", "info");
    navigate("/login");
  };

  // Auto logout
  useAutoLogout(user, handleLogout);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition">
      {user && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      <div className={user ? "pt-20 px-4" : "px-4"}>
        <Routes>
          {/* Default */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Auth */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register onSuccess={() => navigate("/login")} />
              )
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />

          <Route
            path="/patient-profile"
            element={user ? <PatientProfile /> : <Navigate to="/login" />}
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

          {/* Favorites */}
          <Route
            path="/favorites"
            element={user ? <Favorites /> : <Navigate to="/login" />}
          />

          {/* Emergency */}
          <Route
            path="/emergency"
            element={user ? <EmergencyDashboard user={user} /> : <Navigate to="/login" />}
          />

          {/* Patients */}
          <Route
            path="/patients"
            element={user ? <PatientManagement /> : <Navigate to="/login" />}
          />

          {/* Caregivers */}
          <Route
            path="/caregivers"
            element={user ? <Caregivers /> : <Navigate to="/login" />}
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route
  path="/appointments/book/:doctorId"
  element={user ? <BookAppointment /> : <Navigate to="/login" />}
/>

        </Routes>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// PROVIDER WRAPPER
// ------------------------------------------------------------
export default function AppWrapper() {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <ActivityProvider>
          <EnhancedNotificationsProvider>
            <PrescriptionsProvider>
              <MedicalRecordsProvider>
                <DashboardProvider>
                  <SearchProvider>
                    <PatientProfileProvider>
                      <EmergencyProvider>
                        <CaregiverProvider>
                          <App />
                        </CaregiverProvider>
                      </EmergencyProvider>
                    </PatientProfileProvider>
                  </SearchProvider>
                </DashboardProvider>
              </MedicalRecordsProvider>
            </PrescriptionsProvider>
          </EnhancedNotificationsProvider>
        </ActivityProvider>
      </FavoritesProvider>
    </ToastProvider>
  );
}
