// import React, { createContext, useState, useEffect } from "react";

// export const EnhancedNotificationsContext = createContext();

// export const EnhancedNotificationsProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);

//   // Placeholder (later you can fetch from API)
//   useEffect(() => {
//     setNotifications([]);
//   }, []);

//   return (
//     <EnhancedNotificationsContext.Provider value={{ notifications, setNotifications }}>
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
} from "react";

export const EnhancedNotificationsContext = createContext();

export const EnhancedNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 🔄 Recalculate unread count every time notifications change
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // 📌 Mark ONE notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }, []);

  // 📌 Mark ALL as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  }, []);

  // 🗑️ Delete a notification
  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <EnhancedNotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        setNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </EnhancedNotificationsContext.Provider>
  );
};

// 🟢 EXPORT THE HOOK (Required for NotificationsBell)
export const useEnhancedNotifications = () => {
  return useContext(EnhancedNotificationsContext);
};
