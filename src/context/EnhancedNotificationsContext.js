


import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const EnhancedNotificationsContext = createContext(null);

export const useEnhancedNotifications = () => {
  const context = useContext(EnhancedNotificationsContext);
  if (!context) {
    throw new Error(
      "useEnhancedNotifications must be used within EnhancedNotificationsProvider"
    );
  }
  return context;
};

export const EnhancedNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  const updateUnreadCount = (list) => {
    setUnreadCount(list.filter((n) => !n.read).length);
  };

  // 🔔 Fetch notifications
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
      setNotifications(data);
      updateUnreadCount(data);
    } catch (err) {
      console.error("❌ Notification fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("✅ EnhancedNotificationsProvider mounted");
    fetchNotifications();
  }, [fetchNotifications]);

  // ✅ Mark single read
  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    updateUnreadCount(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ✅ Mark all read
  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // ✅ Delete notification
  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${API_BASE}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

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
