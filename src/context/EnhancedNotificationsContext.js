

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";

// const EnhancedNotificationsContext = createContext(null);

// export const useEnhancedNotifications = () => {
//   const context = useContext(EnhancedNotificationsContext);
//   if (!context) {
//     throw new Error(
//       "useEnhancedNotifications must be used within EnhancedNotificationsProvider"
//     );
//   }
//   return context;
// };

// export const EnhancedNotificationsProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const API_BASE = "http://localhost:5000";

//   // 🔔 Sound (loaded once)
//   const notificationSound = useRef(null);
//   const prevCountRef = useRef(0);

//   // Init sound once
//   useEffect(() => {
//     notificationSound.current = new Audio("/notification.mp3");
//     notificationSound.current.volume = 0.6;
//   }, []);

//   const updateUnreadCount = (list) => {
//     setUnreadCount(list.filter((n) => !n.read).length);
//   };

//   // 🔔 Fetch notifications
//   const fetchNotifications = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/api/notifications`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to load notifications");

//       const data = await res.json();

//       // 🔊 Play sound ONLY if new notification arrived
//       if (data.length > prevCountRef.current) {
//         notificationSound.current?.play().catch(() => {});
//       }

//       prevCountRef.current = data.length;

//       setNotifications(data);
//       updateUnreadCount(data);
//     } catch (err) {
//       console.error("❌ Notification fetch failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     console.log("✅ EnhancedNotificationsProvider mounted");
//     fetchNotifications();
//   }, [fetchNotifications]);

//   // ✅ Mark single read
//   const markAsRead = async (id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     await fetch(`${API_BASE}/api/notifications/${id}/read`, {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     updateUnreadCount(
//       notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   // ✅ Mark all read
//   const markAllAsRead = async () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//     setUnreadCount(0);

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     await fetch(`${API_BASE}/api/notifications/read-all`, {
//       method: "PUT",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   };

//   // ✅ Delete notification
//   const deleteNotification = async (id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     await fetch(`${API_BASE}/api/notifications/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   };

//   return (
//     <EnhancedNotificationsContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         loading,
//         markAsRead,
//         markAllAsRead,
//         deleteNotification,
//         refreshNotifications: fetchNotifications,
//       }}
//     >
//       {children}
//     </EnhancedNotificationsContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const EnhancedNotificationsContext = createContext(null);

// --------------------------------------------------
// Hook
// --------------------------------------------------
export const useEnhancedNotifications = () => {
  const context = useContext(EnhancedNotificationsContext);
  if (!context) {
    throw new Error(
      "useEnhancedNotifications must be used within EnhancedNotificationsProvider"
    );
  }
  return context;
};

// --------------------------------------------------
// Provider
// --------------------------------------------------
export const EnhancedNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  // 🔔 Notification sound (loaded once)
  const soundRef = useRef(null);
  const prevCountRef = useRef(0);

  // --------------------------------------------------
  // Init sound ONCE
  // --------------------------------------------------
  useEffect(() => {
    soundRef.current = new Audio("/notification.mp3");
    soundRef.current.volume = 0.6;
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const updateUnreadCount = (list) => {
    setUnreadCount(list.filter((n) => !n.read).length);
  };

  // --------------------------------------------------
  // Fetch notifications
  // --------------------------------------------------
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load notifications");

      const data = await res.json();

      // 🔊 Play sound ONLY if new notifications arrived
      if (data.length > prevCountRef.current) {
        soundRef.current?.play().catch(() => {
          // browser blocked autoplay – safe to ignore
        });
      }

      prevCountRef.current = data.length;

      setNotifications(data);
      updateUnreadCount(data);
    } catch (err) {
      console.error("❌ Notification fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log("✅ EnhancedNotificationsProvider mounted");
    fetchNotifications();
  }, [fetchNotifications]);

  // --------------------------------------------------
  // Mark single notification as read
  // --------------------------------------------------
  const markAsRead = async (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      updateUnreadCount(updated);
      return updated;
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // --------------------------------------------------
  // Mark all as read
  // --------------------------------------------------
  const markAllAsRead = async () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      updateUnreadCount(updated);
      return updated;
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // --------------------------------------------------
  // Delete notification
  // --------------------------------------------------
  const deleteNotification = async (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      updateUnreadCount(updated);
      return updated;
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // --------------------------------------------------
  // Provider value
  // --------------------------------------------------
  return (
    <EnhancedNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </EnhancedNotificationsContext.Provider>
  );
};
