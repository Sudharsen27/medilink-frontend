// Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-green-600 text-white p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-white">Medilink</h2>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded transition-colors ${
              isActive('/dashboard')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/appointments"
            className={`px-4 py-2 rounded transition-colors ${
              isActive('/appointments')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Appointments
          </Link>
          <Link
            to="/profile"
            className={`px-4 py-2 rounded transition-colors ${
              isActive('/profile')
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Profile
          </Link>
        </div>

        {/* User Info + Logout + Dark Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user && <span className="text-white">Welcome, {user.name}</span>}
          {user && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          )}
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
