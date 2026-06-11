// src/components/UserMenu.js
import React, { useState } from 'react';
import Avatar from './Avatar';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Avatar name={user.name} />
        <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
        <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg dark:shadow-glass-lg-dark border border-slate-200/80 dark:border-slate-700/60 py-1 z-50">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
          </div>
          <a
            href="#profile"
            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Profile Settings
          </a>
          <a
            href="#preferences"
            className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Preferences
          </a>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;