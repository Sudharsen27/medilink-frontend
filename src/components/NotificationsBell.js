

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import './NotificationsBell.css';

const NotificationsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id);
    handleNotificationAction(notification);
    setIsOpen(false);
  };

  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case 'appointment':
        window.location.href = '/appointments';
        break;
      case 'prescription':
        window.location.href = '/prescriptions';
        break;
      case 'medical_record':
        window.location.href = '/medical-records';
        break;
      default:
        break;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

    return time.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      prescription: '💊',
      medical_record: '📋',
      system: '🔧',
      reminder: '⏰',
      emergency: '🚨',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="notifications-bell" ref={dropdownRef}>

      {/* 🔔 BELL BUTTON */}
      <button
        className="notifications-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        style={{
          background: 'transparent',
          padding: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* 🔔 SMALL BELL ICON */}
        <span className="bell-icon" style={{ fontSize: '16px' }}>
          🔔 ({unreadCount})
        </span>

        {unreadCount > 0 && (
          <span
            className="notification-badge"
            style={{
              background: 'red',
              color: 'white',
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '50%',
              marginLeft: '3px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 🔻 DROPDOWN */}
      {isOpen && (
        <div className="notifications-dropdown" style={{ background: 'white' }}>
          <div className="notifications-header">
            <h3>Notifications</h3>

            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read-btn">
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="close-dropdown-btn"
                aria-label="Close notifications"
              >
                ×
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <div className="no-notifications-icon">🔔</div>
                <p>No notifications yet</p>
                <span>We'll notify you when something important happens</span>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    borderBottom: '1px solid #eee',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="delete-notification-btn"
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <a href="/notifications" className="view-all-link">
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
