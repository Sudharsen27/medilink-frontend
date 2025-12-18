

import React, { useState, useRef, useEffect } from "react";
import { useEnhancedNotifications } from "../context/EnhancedNotificationsContext";
import "./NotificationsBell.css";

const NotificationsBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
  } = useEnhancedNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavigate = (notification) => {
    if (!notification.read) markAsRead(notification.id);

    switch (notification.type) {
      case "appointment":
        window.location.href = "/appointments";
        break;
      case "prescription":
        window.location.href = "/prescriptions";
        break;
      case "medical_record":
        window.location.href = "/medical-records";
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const formatTime = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="notifications-bell" ref={dropdownRef}>
      <button
        className="notifications-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>Mark all read</button>
            )}
          </div>

          <div className="notifications-list">
            {loading && <p className="loading">Loading…</p>}

            {!loading && notifications.length === 0 && (
              <p className="empty">No notifications yet</p>
            )}

            {notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                className={`notification-item ${
                  !n.read ? "unread" : ""
                }`}
                onClick={() => handleNavigate(n)}
              >
                <div>
                  <p>{n.message}</p>
                  <span>{formatTime(n.created_at)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <a href="/notifications">View all</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
