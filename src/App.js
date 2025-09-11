// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile'; // ✅ Import Profile component

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

        {/* ✅ Added Profile Route */}
        <Route 
          path="/profile" 
          element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
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
