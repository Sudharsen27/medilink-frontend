

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import NotificationsBell from './NotificationsBell';
import { useFavorites } from '../context/FavoritesContext';

// Modern Icon Components using SVG
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Doctor: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Video: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78
      7.78l1.06 1.06L12 21.23l7.78-7.78
      1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79
      8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79
      8-4M4 7c0-2.21 3.582-4 8-4s8 1.79
      8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756
      2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066
      c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572
      c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
      00-1.066 2.573c.94 1.543-.826 3.31-2.37
      2.37a1.724 1.724 0 00-2.572
      1.065c-.426 1.756-2.924 1.756-3.35
      0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37
      a1.724 1.724 0 00-1.065-2.572
      c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
      001.066-2.573c-.94-1.543.826-3.31
      2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6
      4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0
      013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 9l-7 7-7-7" />
    </svg>
  ), 
   PatientProfile: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 21v-1c0-3.314 3.582-6 8-6s8 2.686 8 6v1"
      />
    </svg>
  ),
  Patients: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20v-2a4 4 0 00-3-3.87M9 14.13A4 4 0 006 18v2m12-6a4 4 0 10-8 0 4 4 0 008 0zm-6-7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
    Caregivers: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 20v-2a6 6 0 0112 0v2"
      />
    </svg>
  ),

};


const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
  const location = useLocation();
  const { getFavoriteCount } = useFavorites();
  const favoritesCount = getFavoriteCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 🔍 DEBUG: Log when navbar renders
  // console.log('🎯 NAVBAR: Component rendering with user:', user?.name);
  useEffect(() => {
  console.log("NAVBAR rendered with user:", user);
}, [user]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const navigationLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Icons.Dashboard },
    { to: "/appointments", label: "Appointments", icon: Icons.Calendar },
    { to: "/doctors", label: "Doctors", icon: Icons.Doctor },
    { to: "/telemedicine", label: "Telemedicine", icon: Icons.Video },
    { to: "/profile", label: "Profile", icon: Icons.User },
    
  ];

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-green-600/95 shadow-2xl backdrop-blur-xl"
            : "bg-green-600 shadow-lg"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* LOGO */}
            <Link to="/dashboard" className="flex items-center gap-3 group relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-11 h-11 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center transform group-hover:scale-110
                  group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-1.99.9-1.99
                      2L3 19c0 1.1.9 2 2
                      2h14c1.1 0 2-.9
                      2-2V5c0-1.1-.9-2-2-2zm-1
                      11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
                  </svg>
                </div>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  MediLink
                </h1>
                <p className="text-xs text-white/80 -mt-1">Healthcare Platform</p>
              </div>

              <span className="sm:hidden text-2xl font-bold text-white">ML</span>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-2">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
                      ${isActive(link.to)
                        ? "bg-white/25 text-white shadow-lg scale-105"
                        : "text-white/90 hover:bg-white/15 hover:text-white hover:scale-105"
                      }`}
                  >
                    <IconComponent />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                );
              })}

              {/* FAVORITES */}
              <Link
                to="/favorites"
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 relative 
                  ${isActive("/favorites")
                    ? "bg-white/25 text-white shadow-lg scale-105"
                    : "text-white/90 hover:bg-white/15 hover:text-white hover:scale-105"
                  }`}
              >
                <Icons.Heart />
                <span className="text-sm">Favorites</span>
                {favoritesCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r
                    from-red-500 to-pink-500 text-white text-xs font-bold rounded-full px-1.5
                    flex items-center justify-center shadow-lg animate-pulse">
                    {favoritesCount}
                  </div>
                )}
              </Link>

              {/* DATA BACKUP */}
              {/* <Link
                to="/data-backup"
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
                  ${isActive("/data-backup")
                    ? "bg-white/25 text-white shadow-lg scale-105"
                    : "text-white/90 hover:bg-white/15 hover:text-white hover:scale-105"
                  }`}
              >
                <Icons.Database />
                <span className="text-sm">Backup</span>
              </Link> */}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4">

              {/* 🔔 NOTIFICATIONS BELL - DESKTOP - FIXED */}
              <div className="hidden lg:block">
                <NotificationsBell />
              </div>

              {/* DARK MODE - DESKTOP */}
              <div className="hidden md:block">
                <div className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
                </div>
              </div>

              {/* USER MENU DESKTOP */}
              {user && (
                <div className="hidden lg:block relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 bg-white/15 hover:bg-white/25
                      px-3 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                  >
                    {/* <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-green-600
                      rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div> */}
                    <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md bg-white/20">
  {user.photo ? (
    <img
      // src={`http://localhost:5000/uploads/${user.photo}`}
        src={user.photo}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center
      bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-sm">
      {user.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  )}
</div>

                    <span className="text-white text-sm truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <Icons.ChevronDown />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800
                      rounded-2xl shadow-2xl py-2 border dark:border-gray-700 overflow-hidden animate-slideDown">
                      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-700">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {user.email || "user@medilink.com"}
                        </p>
                      </div>

                      <Link to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 border-l-4 border-transparent 
               hover:border-green-500 transition-all duration-200 
               hover:bg-green-50 dark:hover:bg-gray-700">
                        <Icons.User  className="w-5 h-5 text-green-600 dark:text-green-400"/>
                        My Profile
                      </Link>
     <Link
  to="/patient-profile"
  className="flex items-center gap-3 px-4 py-2.5 border-l-4 border-transparent 
               hover:border-green-500 transition-all duration-200 
               hover:bg-green-50 dark:hover:bg-gray-700"
>
  <Icons.PatientProfile className="w-5 h-5 text-green-600 dark:text-green-400" />
  <span className="font-medium">Patient Profile</span>
</Link>
<li>
  <Link
    to="/patients"
    className="flex items-center gap-3 px-4 py-2.5 border-l-4 border-transparent 
               hover:border-green-500 transition-all duration-200 
               hover:bg-green-50 dark:hover:bg-gray-700"
  >
    <Icons.Patients className="w-5 h-5 text-green-600 dark:text-green-400" />
    <span className="font-medium">Patient Management</span>
  </Link>
</li>
<Link
  to="/caregivers"
  className="flex items-center gap-3 px-4 py-2.5 border-l-4 border-transparent 
             hover:border-green-500 transition-all duration-200 
             hover:bg-green-50 dark:hover:bg-gray-700"
>
  <Icons.Caregivers className="w-5 h-5 text-green-600 dark:text-green-400" />
  <span className="font-medium">Caregiver Mode</span>
</Link>




                      <Link to="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 border-l-4 border-transparent 
               hover:border-green-500 transition-all duration-200 
               hover:bg-green-50 dark:hover:bg-gray-700">
                        <Icons.Settings />
                        Settings
                      </Link>

                      <div className="border-t dark:border-gray-700 mt-1">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Icons.Logout />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-white hover:bg-white/15 rounded-xl"
              >
                {isMenuOpen ? <Icons.Close /> : <Icons.Menu />}
              </button>

            </div>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)} />
        )}

        {/* MOBILE MENU */}
        <div className={`lg:hidden fixed top-16 right-0 bottom-0 w-80 max-w-[85vw] bg-green-700
          shadow-2xl z-50 transform transition-transform duration-300 ease-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="h-full overflow-y-auto p-6 space-y-6">

            {/* USER INFO MOBILE */}
            {user && (
              <div className="bg-white/15 rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  {/* <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600
                    rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div> */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg bg-white/20">
  {user.photo ? (
    <img
      // src={`http://localhost:5000/uploads/${user.photo}`}
        src={user.photo}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center
      bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-xl">
      {user.name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  )}
</div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-lg truncate">{user.name}</p>
                    <p className="text-green-100 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* NAVIGATION MOBILE */}
            <div className="space-y-2">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link key={link.to} to={link.to}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                      ${isActive(link.to)
                        ? "bg-white/25 text-white scale-105"
                        : "text-white/90 hover:bg-white/15"
                      }`}>
                    <IconComponent />
                    <span className="font-medium flex-1">{link.label}</span>
                  </Link>
                );
              })}

              {/* FAVORITES MOBILE */}
              <Link to="/favorites"
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                  ${isActive("/favorites")
                    ? "bg-white/25 text-white scale-105"
                    : "text-white/90 hover:bg-white/15"
                  }`}>
                <Icons.Heart />
                <span className="font-medium flex-1">Favorites</span>
                {favoritesCount > 0 && (
                  <div className="min-w-[24px] h-6 bg-red-500 text-white text-xs font-bold
                    rounded-full px-2 flex items-center justify-center shadow-lg">
                    {favoritesCount}
                  </div>
                )}
              </Link>

              {/* DATA BACKUP MOBILE */}
              {/* <Link to="/data-backup"
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all
                  ${isActive("/data-backup")
                    ? "bg-white/25 text-white scale-105"
                    : "text-white/90 hover:bg-white/15"
                  }`}>
                <Icons.Database />
                <span className="font-medium flex-1">Data Backup</span>
              </Link> */}
            </div>

            {/* 🔔 NOTIFICATIONS MOBILE */}
            <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between">
              <span className="text-white font-medium">Notifications</span>
              <NotificationsBell />
            </div>

            {/* SETTINGS MOBILE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/15 p-4 rounded-xl">
                <div className="flex items-center gap-3 text-white">
                  <span className="font-medium">Dark Mode</span>
                </div>
                <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              </div>
            </div>

            {/* LOGOUT MOBILE */}
            {user && (
              <button onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-4
                  bg-red-600 text-white font-semibold rounded-xl">
                <Icons.Logout />
                Logout
              </button>
            )}

          </div>
        </div>

      </nav>

      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;