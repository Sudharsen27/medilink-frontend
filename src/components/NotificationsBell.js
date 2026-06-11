import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, X, ArrowRight } from "lucide-react";
import { useEnhancedNotifications } from "../context/EnhancedNotificationsContext";
import {
  getNotificationMeta,
  formatNotificationTime,
  isNotificationUnread,
} from "../lib/notificationUtils";

const NotificationsBell = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useEnhancedNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = (notification) => {
    if (isNotificationUnread(notification)) markAsRead(notification.id);
    const meta = getNotificationMeta(notification);
    setIsOpen(false);
    navigate(meta.route(notification));
  };

  const preview = notifications.slice(0, 5);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-clinical-rose text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 shadow-glass-lg overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/40">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                </p>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="p-2 rounded-lg text-health-600 hover:bg-health-50 dark:hover:bg-health-950/40 transition-colors"
                    title="Mark all read"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto sidebar-scroll">
              {preview.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No notifications yet</p>
                </div>
              ) : (
                preview.map((notification) => {
                  const meta = getNotificationMeta(notification);
                  const Icon = meta.icon;
                  const unread = isNotificationUnread(notification);

                  return (
                    <div
                      key={notification.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpen(notification)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleOpen(notification);
                        }
                      }}
                      className={`w-full flex gap-3 px-4 py-3 text-left border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        unread ? "bg-health-50/30 dark:bg-health-950/10" : ""
                      }`}
                    >
                      <div
                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${meta.styles.icon}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatNotificationTime(notification.created_at)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="shrink-0 p-1 text-slate-300 hover:text-clinical-rose"
                        aria-label="Delete"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-health-700 dark:text-health-400 hover:bg-health-50 dark:hover:bg-health-950/30 transition-colors border-t border-slate-200/60 dark:border-slate-700/60"
            >
              Open notification center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsBell;
