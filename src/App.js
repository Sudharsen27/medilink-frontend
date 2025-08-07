import React, { useEffect, useState } from 'react';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import Register from './components/Register';
import Login from './components/Login';
import { fetchAppointments } from './api/appointments';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', or 'appointments'
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments when logged in
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

  // ---------- UI Render ----------
  if (!user) {
    return (
      <div className="App">
        {view === 'register' ? (
          <>
            <h2>Register</h2>
            <Register onSuccess={() => setView('login')} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setView('login')}>Login</button>
            </p>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <Login
              onLogin={(loggedInUser) => {
                setUser(loggedInUser);
                setView('appointments');
              }}
            />
            <p>
              New user?{' '}
              <button onClick={() => setView('register')}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Welcome, {user.name}</h1>

      <button onClick={() => {
        setUser(null);
        setView('login');
        setAppointments([]);
        localStorage.removeItem('token'); // Optional: if you're using JWT
      }}>
        Logout
      </button>

      <AppointmentForm onAdd={handleAddAppointment} />
      <AppointmentList appointments={appointments} />
    </div>
  );
}

export default App;
