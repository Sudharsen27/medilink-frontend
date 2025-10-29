// components/RecentAppointments.js
import React from 'react';
import Avatar from './Avatar';

const RecentAppointments = ({ appointments, onViewAll }) => {
  const recentAppointments = appointments.slice(0, 5);

  const getStatusStyles = (status) => {
    const baseStyles = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'confirmed':
        return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case 'pending':
        return `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300`;
      case 'cancelled':
        return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      case 'completed':
        return `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    return {
      date: date.toLocaleDateString('en-US', options),
      time: timeString || 'No time specified'
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Appointments
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your most recent scheduled appointments
          </p>
        </div>
        <button 
          onClick={onViewAll}
          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          View All →
        </button>
      </div>
      
      <div className="p-6 space-y-4">
        {recentAppointments.length > 0 ? (
          recentAppointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.date, appointment.time);
            
            return (
              <div 
                key={appointment.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar 
                    name={appointment.userName || appointment.title || 'User'} 
                    src={appointment.avatar} 
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {appointment.title || 'Appointment'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.userName || 'No name provided'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {date} • {time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={getStatusStyles(appointment.status)}>
                    {appointment.status || 'pending'}
                  </span>
                  
                  {appointment.urgent && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              No appointments found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Schedule your first appointment to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAppointments;