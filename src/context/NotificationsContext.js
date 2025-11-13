// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useToast } from './ToastContext';
// import { useActivity } from './ActivityContext';

// const NotificationsContext = createContext();

// export const useNotifications = () => {
//   const context = useContext(NotificationsContext);
//   if (!context) {
//     throw new Error('useNotifications must be used within a NotificationsProvider');
//   }
//   return context;
// };

// export const NotificationsProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [ws, setWs] = useState(null);
//   const { addToast } = useToast();
//   const { addActivity, activityTemplates } = useActivity();

//   // Load notifications from backend
//   useEffect(() => {
//     fetchNotifications();
//     setupWebSocket();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/notifications', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setNotifications(data);
//         updateUnreadCount(data);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupWebSocket = () => {
//     // In production, use your WebSocket server URL
//     const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
//     const websocket = new WebSocket(wsUrl);

//     websocket.onopen = () => {
//       console.log('🔌 WebSocket connected');
//       // Send authentication token
//       const token = localStorage.getItem('token');
//       websocket.send(JSON.stringify({ type: 'auth', token }));
//     };

//     websocket.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       handleWebSocketMessage(message);
//     };

//     websocket.onclose = () => {
//       console.log('🔌 WebSocket disconnected');
//       // Attempt reconnect after 5 seconds
//       setTimeout(setupWebSocket, 5000);
//     };

//     setWs(websocket);
//   };

//   const handleWebSocketMessage = (message) => {
//     switch (message.type) {
//       case 'new_notification':
//         handleNewNotification(message.data);
//         break;
//       case 'appointment_reminder':
//         handleAppointmentReminder(message.data);
//         break;
//       case 'prescription_ready':
//         handlePrescriptionReady(message.data);
//         break;
//       default:
//         console.log('Unknown message type:', message.type);
//     }
//   };

//   const handleNewNotification = (notification) => {
//     setNotifications(prev => [notification, ...prev]);
//     setUnreadCount(prev => prev + 1);
    
//     // Show toast for important notifications
//     if (notification.priority === 'high') {
//       addToast(notification.message, 'info');
//     }

//     // Add to activity feed
//     addActivity({
//       type: 'notification',
//       title: 'New Notification',
//       message: notification.message,
//       icon: '🔔',
//       important: notification.priority === 'high'
//     });
//   };

//   const handleAppointmentReminder = (data) => {
//     const activity = activityTemplates.reminder(
//       `Appointment with ${data.doctorName}`,
//       `${data.date} at ${data.time}`
//     );
//     addActivity(activity);
    
//     addToast(`Reminder: Appointment with ${data.doctorName} in 1 hour`, 'warning');
//   };

//   const handlePrescriptionReady = (data) => {
//     addActivity(activityTemplates.prescriptionReady());
//     addToast('Your prescription is ready for pickup', 'success');
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await fetch(`/api/notifications/${notificationId}/read`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       setNotifications(prev =>
//         prev.map(notif =>
//           notif.id === notificationId ? { ...notif, read: true, read_at: new Date().toISOString() } : notif
//         )
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await fetch('/api/notifications/read-all', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       setNotifications(prev =>
//         prev.map(notif => ({ ...notif, read: true, read_at: new Date().toISOString() }))
//       );
//       setUnreadCount(0);
//       addToast('All notifications marked as read', 'success');
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await fetch(`/api/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
//       // Update unread count if the deleted notification was unread
//       const deletedNotif = notifications.find(n => n.id === notificationId);
//       if (deletedNotif && !deletedNotif.read) {
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       }
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   const updateUnreadCount = (notificationsList) => {
//     const unread = notificationsList.filter(notif => !notif.read).length;
//     setUnreadCount(unread);
//   };

//   const getUnreadNotifications = () => {
//     return notifications.filter(notif => !notif.read);
//   };

//   const value = {
//     notifications,
//     unreadCount,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     getUnreadNotifications,
//     fetchNotifications
//   };

//   return (
//     <NotificationsContext.Provider value={value}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useToast } from './ToastContext';
// import { useActivity } from './ActivityContext';

// const NotificationsContext = createContext();

// export const useNotifications = () => useContext(NotificationsContext);

// export const NotificationsProvider = ({ children }) => {
//   const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
//   const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:5000";

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const { addToast } = useToast();
//   const { addActivity, activityTemplates } = useActivity();

//   // ==========================
//   // 1️⃣ LOAD NOTIFICATIONS FROM BACKEND
//   // ==========================
//   useEffect(() => {
//     fetchNotifications();
//     setupWebSocket();
//     // eslint-disable-next-line
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${API_BASE}/api/notifications`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!res.ok) return;

//       const data = await res.json();
//       setNotifications(data);
//       updateUnreadCount(data);

//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // 2️⃣ WEBSOCKET SETUP
//   // ==========================
//   const setupWebSocket = () => {
//     const ws = new WebSocket(WS_URL);

//     ws.onopen = () => {
//       console.log("🔌 WebSocket connected");

//       const token = localStorage.getItem("token");
//       ws.send(JSON.stringify({ type: "auth", token }));
//     };

//     ws.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       handleWebSocketMessage(msg);
//     };

//     ws.onclose = () => {
//       console.log("🔌 WebSocket disconnected");
//       setTimeout(setupWebSocket, 5000); // Reconnect
//     };
//   };

//   // Handle backend WebSocket messages
//   const handleWebSocketMessage = (msg) => {
//     switch (msg.type) {
//       case "new_notification":
//         return handleNewNotification(msg.data);

//       case "appointment_reminder":
//         return handleAppointmentReminder(msg.data);

//       case "prescription_ready":
//         return handlePrescriptionReady(msg.data);

//       default:
//         console.warn("Unknown WS message:", msg);
//     }
//   };

//   // ==========================
//   // 3️⃣ NOTIFICATION HANDLERS
//   // ==========================
//   const handleNewNotification = (notification) => {
//     setNotifications(prev => [notification, ...prev]);
//     setUnreadCount(prev => prev + 1);

//     if (notification.priority === "high") {
//       addToast(notification.message, "info");
//     }

//     addActivity({
//       type: "notification",
//       title: "New Notification",
//       message: notification.message,
//       icon: "🔔",
//       important: notification.priority === "high",
//     });
//   };

//   const handleAppointmentReminder = (data) => {
//     addActivity(activityTemplates.reminder(
//       `Appointment with ${data.doctorName}`,
//       `${data.date} at ${data.time}`
//     ));

//     addToast(`Reminder: Appointment with ${data.doctorName}`, "warning");
//   };

//   const handlePrescriptionReady = (data) => {
//     addActivity(activityTemplates.prescriptionReady());
//     addToast("Your prescription is ready", "success");
//   };

//   // ==========================
//   // 4️⃣ MARK AS READ
//   // ==========================
//   const markAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`${API_BASE}/api/notifications/${id}/read`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(prev =>
//         prev.map(n => (n.id === id ? { ...n, read: true } : n))
//       );

//       setUnreadCount(prev => Math.max(0, prev - 1));

//     } catch (err) {
//       console.error("Failed to mark as read:", err);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`${API_BASE}/api/notifications/read-all`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(prev =>
//         prev.map(n => ({ ...n, read: true }))
//       );

//       setUnreadCount(0);
//       addToast("All notifications marked as read", "success");

//     } catch (err) {
//       console.error("Failed to mark all as read:", err);
//     }
//   };

//   // ==========================
//   // 5️⃣ DELETE NOTIFICATION
//   // ==========================
//   const deleteNotification = async (id) => {
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(`${API_BASE}/api/notifications/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.filter(n => n.id !== id));

//     } catch (err) {
//       console.error("Failed to delete:", err);
//     }
//   };

//   // ==========================
//   // Helpers
//   // ==========================
//   const updateUnreadCount = (list) => {
//     setUnreadCount(list.filter(n => !n.read).length);
//   };

//   const value = {
//     notifications,
//     unreadCount,
//     loading,
//     fetchNotifications,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//   };

//   return (
//     <NotificationsContext.Provider value={value}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

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