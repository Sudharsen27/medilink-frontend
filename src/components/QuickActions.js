// components/QuickActions.js
import React from 'react';

const QuickActions = ({ onAction, unreadNotifications = 0 }) => {
  const actions = [
    {
      id: 'new-appointment',
      label: 'New Appointment',
      icon: '➕',
      description: 'Schedule new appointment',
      color: 'blue'
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: '🔄',
      description: 'Update latest information',
      color: 'green'
    },
    {
      id: 'print',
      label: 'Print Report',
      icon: '🖨️',
      description: 'Generate printable report',
      color: 'purple'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '🔔',
      description: 'View your notifications',
      color: 'yellow',
      badge: unreadNotifications
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${colorClasses[action.color]}`}
          >
            <div className="relative">
              <span className="text-2xl mb-2">{action.icon}</span>
              {action.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-pulse">
                  {action.badge}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-center">{action.label}</span>
            <span className="text-xs opacity-75 text-center mt-1">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;