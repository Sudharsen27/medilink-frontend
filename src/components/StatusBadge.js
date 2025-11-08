import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, size = 'medium', showIcon = true }) => {
  const statusConfig = {
    scheduled: {
      color: 'blue',
      text: 'Scheduled',
      icon: '📅'
    },
    confirmed: {
      color: 'green',
      text: 'Confirmed',
      icon: '✅'
    },
    cancelled: {
      color: 'red',
      text: 'Cancelled',
      icon: '❌'
    },
    completed: {
      color: 'gray',
      text: 'Completed',
      icon: '✔️'
    },
    pending: {
      color: 'yellow',
      text: 'Pending',
      icon: '⏳'
    },
    rescheduled: {
      color: 'purple',
      text: 'Rescheduled',
      icon: '🔄'
    },
    in_progress: {
      color: 'orange',
      text: 'In Progress',
      icon: '👨‍⚕️'
    }
  };

  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <span className={`status-badge status-badge--${config.color} status-badge--${size}`}>
      {showIcon && <span className="status-badge__icon">{config.icon}</span>}
      <span className="status-badge__text">{config.text}</span>
    </span>
  );
};

export default StatusBadge;