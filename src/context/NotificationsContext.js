

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Get authentication token
  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!getToken();
  }, [getToken]);

  // Update unread count helper
  const updateUnreadCount = useCallback((notificationsList) => {
    const count = notificationsList.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, []);

  // ==========================
  // 1️⃣ LOAD NOTIFICATIONS FROM BACKEND
  // ==========================
  const fetchNotifications = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/notifications`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
      updateUnreadCount(data);

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Fallback: Use empty array instead of failing
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, getToken, updateUnreadCount]);

  // Initialize notifications on mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchNotifications]);

  // ==========================
  // 2️⃣ MARK AS READ
  // ==========================
  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      updateUnreadCount(notifications.map(n => n.id === id ? {...n, read: true} : n));

      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Revert optimistic update if failed
        await fetchNotifications();
        throw new Error('Failed to mark as read');
      }

    } catch (error) {
      console.error("Failed to mark as read:", error);
      // Revert by refetching
      await fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);

      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "PUT",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      addToast("All notifications marked as read", "success");

    } catch (error) {
      console.error("Failed to mark all as read:", error);
      // Revert by refetching
      await fetchNotifications();
    }
  };

  // ==========================
  // 3️⃣ DELETE NOTIFICATION
  // ==========================
  const deleteNotification = async (id) => {
    try {
      // Optimistic update
      const notificationToDelete = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Revert by refetching
      await fetchNotifications();
    }
  };

  // ==========================
  // 4️⃣ ADD NOTIFICATION (for testing/real-time)
  // ==========================
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    if (isAuthenticated()) {
      fetchNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications: refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification, // For real-time updates
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};