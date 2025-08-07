// App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import Register from './components/Register';
import Login from './components/Login';
import { fetchAppointments } from './api/appointments';

function App() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const response = await fetchAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleAddAppointment = (newAppointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const handleLogout = () => {
    setUser(null);
    setAppointments([]);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        {/* Redirect to login if not logged in */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/appointments" />
            ) : (
              <Login onLogin={(loggedInUser) => {
                setUser(loggedInUser);
                navigate('/appointments');
              }} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/appointments" />
            ) : (
              <Register onSuccess={() => navigate('/login')} />
            )
          }
        />

        <Route
          path="/appointments"
          element={
            user ? (
              <div>
                <h1>Welcome, {user.name}</h1>
                <button onClick={handleLogout}>Logout</button>
                <AppointmentForm onAdd={handleAddAppointment} />
                <AppointmentList appointments={appointments} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
