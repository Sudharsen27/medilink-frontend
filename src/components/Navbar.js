// // Navbar.jsx
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import DarkModeToggle from './DarkModeToggle';
// const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className="bg-green-600 text-white p-4 fixed w-full top-0 z-50">
//       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//         {/* Logo */}
//         <div className="mb-4 md:mb-0">
//           <h2 className="text-2xl font-bold text-white">Medilink</h2>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
//           <Link
//             to="/dashboard"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/dashboard')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/appointments"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/appointments')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Appointments
//           </Link>
//           <Link
//             to="/profile"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/profile')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Profile
//           </Link>
//             <Link
//             to="/doctors"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/doctors')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//           Doctors
//           </Link>
//           <Link
//   to="/telemedicine"
//   onClick={() => console.log('Telemedicine link clicked')}
//   className={`px-4 py-2 rounded transition-colors ${
//     isActive('/telemedicine')
//       ? 'bg-gray-700 text-white'
//       : 'text-gray-300 hover:bg-gray-700'
//   }`}
// >
//   Telemedicine
// </Link>

//         </div>

//         {/* User Info + Logout + Dark Mode Toggle */}
//         <div className="flex flex-col sm:flex-row items-center gap-3">
//           {user && <span className="text-white">Welcome, {user.name}</span>}
//           {user && (
//             <button
//               onClick={onLogout}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
//             >
//               Logout
//             </button>
//           )}
//           <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import DarkModeToggle from './DarkModeToggle';

// const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className="bg-green-600 text-white p-4 fixed w-full top-0 z-50">
//       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//         {/* Logo */}
//         <div className="mb-4 md:mb-0">
//           <h2 className="text-2xl font-bold text-white">Medilink</h2>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
//           <Link
//             to="/dashboard"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/dashboard')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/appointments"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/appointments')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Appointments
//           </Link>
//           <Link
//             to="/profile"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/profile')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Profile
//           </Link>
//           <Link
//             to="/doctors"
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/doctors')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Doctors
//           </Link>
//           <Link
//             to="/telemedicine"
//             onClick={() => console.log('Telemedicine link clicked')}
//             className={`px-4 py-2 rounded transition-colors ${
//               isActive('/telemedicine')
//                 ? 'bg-gray-700 text-white'
//                 : 'text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             Telemedicine
//           </Link>
//         </div>

//         {/* User Info + Logout + Dark Mode Toggle */}
//         <div className="flex flex-col sm:flex-row items-center gap-3">
//           {user && (
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full font-bold uppercase">
//                 {user.name?.charAt(0) || 'U'}
//               </div>
//               <span className="text-white font-medium">{user.name}</span>
//             </div>
//           )}
//           {user && (
//             <button
//               onClick={onLogout}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
//             >
//               Logout
//             </button>
//           )}
//           <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-green-600 text-white p-4 fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-white">Medilink</h2>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/appointments', label: 'Appointments' },
            { to: '/profile', label: 'Profile' },
            { to: '/doctors', label: 'Doctors' },
            { to: '/telemedicine', label: 'Telemedicine' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded transition-colors ${
                isActive(link.to)
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Info + Logout + Dark Mode */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-800 text-white rounded-full font-bold uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="text-white font-medium">{user.name}</span>
            </div>
          )}
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
