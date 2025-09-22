// App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Appointments from './components/Appointments';
import Navbar from './components/Navbar';

function App() {
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
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      
      <div className={user ? 'pt-16' : ''}>
        <Routes>
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
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route 
            path="/profile" 
            element={user ? <Profile user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/appointments" 
            element={user ? <Appointments user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;