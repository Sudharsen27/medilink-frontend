// import React, { useState, useRef, useEffect } from 'react';
// import { useNotifications } from '../context/NotificationsContext';
// import useOnlineStatus from '../hooks/useOnlineStatus';
// import './NotificationsBell.css';

// const NotificationsBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
//   const { isOnline } = useOnlineStatus();
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
//     // Handle notification action (navigate to relevant page)
//     handleNotificationAction(notification);
//     setIsOpen(false);
//   };

//   const handleNotificationAction = (notification) => {
//     switch (notification.type) {
//       case 'appointment':
//         // Navigate to appointments page
//         window.location.href = '/appointments';
//         break;
//       case 'prescription':
//         // Navigate to prescriptions page
//         window.location.href = '/prescriptions';
//         break;
//       case 'medical_record':
//         // Navigate to medical records page
//         window.location.href = '/medical-records';
//         break;
//       default:
//         // Do nothing
//         break;
//     }
//   };

//   const formatTime = (timestamp) => {
//     const now = new Date();
//     const notificationTime = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return notificationTime.toLocaleDateString();
//   };

//   const getNotificationIcon = (type) => {
//     const icons = {
//       appointment: '📅',
//       prescription: '💊',
//       medical_record: '📋',
//       system: '🔧',
//       reminder: '⏰',
//       emergency: '🚨'
//     };
//     return icons[type] || '🔔';
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       high: 'notification-priority-high',
//       medium: 'notification-priority-medium',
//       low: 'notification-priority-low'
//     };
//     return colors[priority] || '';
//   };

//   return (
//     <div className="notifications-bell" ref={dropdownRef}>
//       <button
//         className="notifications-trigger"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//       >
//         <span className="bell-icon">🔔</span>
//         {unreadCount > 0 && (
//           <span className="notification-badge">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//         {!isOnline && (
//           <span className="offline-indicator" title="Offline - Notifications may be delayed">
//             🔴
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="notifications-dropdown">
//           <div className="notifications-header">
//             <h3>Notifications</h3>
//             <div className="notifications-actions">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="mark-all-read-btn"
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="close-dropdown-btn"
//                 aria-label="Close notifications"
//               >
//                 ×
//               </button>
//             </div>
//           </div>

//           <div className="notifications-list">
//             {notifications.length === 0 ? (
//               <div className="no-notifications">
//                 <div className="no-notifications-icon">🔔</div>
//                 <p>No notifications yet</p>
//                 <span>We'll notify you when something important happens</span>
//               </div>
//             ) : (
//               notifications.slice(0, 10).map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${!notification.read ? 'notification-unread' : ''} ${getPriorityColor(notification.priority)}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="notification-icon">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="notification-content">
//                     <p className="notification-message">
//                       {notification.message}
//                     </p>
//                     <div className="notification-meta">
//                       <span className="notification-time">
//                         {formatTime(notification.created_at)}
//                       </span>
//                       {notification.priority === 'high' && (
//                         <span className="priority-indicator">Important</span>
//                       )}
//                     </div>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteNotification(notification.id);
//                     }}
//                     className="delete-notification-btn"
//                     aria-label="Delete notification"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>

//           {notifications.length > 0 && (
//             <div className="notifications-footer">
//               <a href="/notifications" className="view-all-link">
//                 View all notifications
//               </a>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsBell;

// import React, { useState, useRef, useEffect } from 'react';
// import './NotificationsBell.css';

// const NotificationsBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownRef = useRef(null);

//   // 🔧 DEBUG: Mock data with your actual database data
//   useEffect(() => {
//     console.log('🔄 Loading mock notifications...');
    
//     // Use your actual database data from the screenshot
//     const mockNotifications = [
//       {
//         id: 2,
//         user_id: 1,
//         type: 'appointment',
//         title: 'Test Appointment',
//         message: 'System test',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: null,
//         created_at: '2025-11-13T18:21:06.296Z'
//       },
//       {
//         id: 3,
//         user_id: 1,
//         type: 'appointment', 
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 106,
//         created_at: '2025-11-13T18:26:22.541Z'
//       },
//       {
//         id: 4,
//         user_id: 1,
//         type: 'appointment',
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 107,
//         created_at: '2025-11-13T18:28:25.794Z'
//       },
//       {
//         id: 5,
//         user_id: 1,
//         type: 'appointment',
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 108,
//         created_at: '2025-11-13T18:28:38.379Z'
//       },
//       {
//         id: 9,
//         user_id: 32,
//         type: 'appointment',
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 112,
//         created_at: '2025-11-13T18:40:32.305Z'
//       },
//       {
//         id: 11,
//         user_id: 1,
//         type: 'appointment',
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 114,
//         created_at: '2025-11-13T18:45:55.132Z'
//       },
//       {
//         id: 12,
//         user_id: 1,
//         type: 'appointment',
//         title: 'New Appointment',
//         message: 'Your appointment has been scheduled',
//         priority: 'medium',
//         read: false,
//         read_at: null,
//         related_entity_type: 'appointment',
//         related_entity_id: 115,
//         created_at: '2025-11-13T18:47:34.285Z'
//       }
//     ];
    
//     // Filter for user_id 1 (your admin account)
//     const userNotifications = mockNotifications.filter(n => n.user_id === 1);
    
//     console.log('📋 All mock notifications:', mockNotifications);
//     console.log('👤 Notifications for user_id 1:', userNotifications);
//     console.log('🔴 Unread count:', userNotifications.filter(n => !n.read).length);
    
//     setNotifications(userNotifications);
//     setUnreadCount(userNotifications.filter(n => !n.read).length);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       console.log('🖱️ Click outside detected');
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         console.log('📪 Closing dropdown');
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = (notification) => {
//     console.log('📨 Notification clicked:', notification);
//     if (!notification.read) {
//       setNotifications(prev => 
//         prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
//       );
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     }
//     setIsOpen(false);
//   };

//   const markAllAsRead = () => {
//     console.log('📭 Marking all as read');
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//     setUnreadCount(0);
//   };

//   const deleteNotification = (id) => {
//     console.log('🗑️ Deleting notification:', id);
//     setNotifications(prev => prev.filter(n => n.id !== id));
//     setUnreadCount(prev => Math.max(0, prev - 1));
//   };

//   const formatTime = (timestamp) => {
//     const now = new Date();
//     const notificationTime = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return notificationTime.toLocaleDateString();
//   };

//   const getNotificationIcon = (type) => {
//     const icons = {
//       appointment: '📅',
//       prescription: '💊',
//       medical_record: '📋',
//       system: '🔧',
//       reminder: '⏰',
//       emergency: '🚨'
//     };
//     return icons[type] || '🔔';
//   };

//   console.log('🎬 NotificationsBell rendering with:', {
//     isOpen,
//     notificationsCount: notifications.length,
//     unreadCount,
//     notifications
//   });

//   return (
//     <div className="notifications-bell" ref={dropdownRef}>
//       <button
//         className="notifications-trigger"
//         onClick={() => {
//           console.log('🔔 Bell clicked! Current state:', { isOpen, notificationsCount: notifications.length });
//           setIsOpen(!isOpen);
//         }}
//         aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//       >
//         <span className="bell-icon">🔔</span>
//         {unreadCount > 0 && (
//           <span className="notification-badge">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="notifications-dropdown">
//           <div className="notifications-header">
//             <h3>Notifications</h3>
//             <div className="notifications-actions">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="mark-all-read-btn"
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="close-dropdown-btn"
//                 aria-label="Close notifications"
//               >
//                 ×
//               </button>
//             </div>
//           </div>

//           <div className="notifications-list">
//             {notifications.length === 0 ? (
//               <div className="no-notifications">
//                 <div className="no-notifications-icon">🔔</div>
//                 <p>No notifications yet</p>
//                 <span>We'll notify you when something important happens</span>
//               </div>
//             ) : (
//               notifications.slice(0, 10).map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="notification-icon">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="notification-content">
//                     <p className="notification-title">{notification.title}</p>
//                     <p className="notification-message">
//                       {notification.message}
//                     </p>
//                     <div className="notification-meta">
//                       <span className="notification-time">
//                         {formatTime(notification.created_at)}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteNotification(notification.id);
//                     }}
//                     className="delete-notification-btn"
//                     aria-label="Delete notification"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>

//           {notifications.length > 0 && (
//             <div className="notifications-footer">
//               <a href="/notifications" className="view-all-link">
//                 View all notifications ({notifications.length})
//               </a>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsBell;

// import React, { useState, useRef, useEffect } from 'react';
// import { useNotifications } from '../context/NotificationsContext'; // Make sure this path is correct
// import './NotificationsBell.css';

// const NotificationsBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
//   const dropdownRef = useRef(null);

//   // 🔍 DEBUG LOGS - These are crucial for troubleshooting
//   console.log('🎬 NotificationsBell RENDERED');
//   console.log('📋 Notifications from context:', notifications);
//   console.log('🔴 Unread count:', unreadCount);
//   console.log('🔄 Loading:', loading);
//   console.log('🔔 Is Open:', isOpen);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
//     handleNotificationAction(notification);
//     setIsOpen(false);
//   };

//   const handleNotificationAction = (notification) => {
//     switch (notification.type) {
//       case 'appointment':
//         window.location.href = '/appointments';
//         break;
//       case 'prescription':
//         window.location.href = '/prescriptions';
//         break;
//       case 'medical_record':
//         window.location.href = '/medical-records';
//         break;
//       default:
//         break;
//     }
//   };

//   const formatTime = (timestamp) => {
//     const now = new Date();
//     const notificationTime = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return notificationTime.toLocaleDateString();
//   };

//   const getNotificationIcon = (type) => {
//     const icons = {
//       appointment: '📅',
//       prescription: '💊',
//       medical_record: '📋',
//       system: '🔧',
//       reminder: '⏰',
//       emergency: '🚨'
//     };
//     return icons[type] || '🔔';
//   };

//   return (
//     <div className="notifications-bell" ref={dropdownRef}>
//       <button
//         className="notifications-trigger"
//         onClick={() => {
//           console.log('🔔 Bell clicked - Opening dropdown');
//           console.log('Current notifications:', notifications);
//           setIsOpen(!isOpen);
//         }}
//         aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//       >
//         <span className="bell-icon">🔔</span>
//         {unreadCount > 0 && (
//           <span className="notification-badge">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="notifications-dropdown">
//           <div className="notifications-header">
//             <h3>Notifications</h3>
//             <div className="notifications-actions">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={markAllAsRead}
//                   className="mark-all-read-btn"
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="close-dropdown-btn"
//                 aria-label="Close notifications"
//               >
//                 ×
//               </button>
//             </div>
//           </div>

//           <div className="notifications-list">
//             {notifications.length === 0 ? (
//               <div className="no-notifications">
//                 <div className="no-notifications-icon">🔔</div>
//                 <p>No notifications yet</p>
//                 <span>We'll notify you when something important happens</span>
//               </div>
//             ) : (
//               notifications.slice(0, 10).map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="notification-icon">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="notification-content">
//                     <p className="notification-message">
//                       {notification.message}
//                     </p>
//                     <div className="notification-meta">
//                       <span className="notification-time">
//                         {formatTime(notification.created_at)}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       deleteNotification(notification.id);
//                     }}
//                     className="delete-notification-btn"
//                     aria-label="Delete notification"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>

//           {notifications.length > 0 && (
//             <div className="notifications-footer">
//               <a href="/notifications" className="view-all-link">
//                 View all notifications
//               </a>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsBell;

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationsContext';
import './NotificationsBell.css';

const NotificationsBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
  const dropdownRef = useRef(null);

  // 🔍 DEBUG LOGS - These are crucial for troubleshooting
  console.log('🎬 NotificationsBell RENDERED');
  console.log('📋 Notifications from context:', notifications);
  console.log('🔴 Unread count:', unreadCount);
  console.log('🔄 Loading:', loading);
  console.log('🔔 Is Open:', isOpen);

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
    if (!notification.read) {
      markAsRead(notification.id);
    }
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
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      prescription: '💊',
      medical_record: '📋',
      system: '🔧',
      reminder: '⏰',
      emergency: '🚨'
    };
    return icons[type] || '🔔';
  };

  return (
    <div 
      className="notifications-bell" 
      ref={dropdownRef}
      style={{
        border: '3px solid red',
        background: 'yellow',
        padding: '5px',
        borderRadius: '5px',
        margin: '5px'
      }}
    >
      <button
        className="notifications-trigger"
        onClick={() => {
          console.log('🔔 Bell clicked - Opening dropdown');
          console.log('Current notifications:', notifications);
          setIsOpen(!isOpen);
        }}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        style={{
          background: 'blue',
          color: 'white',
          padding: '8px 12px',
          border: '2px solid white',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        <span className="bell-icon">🔔 BELL ({unreadCount})</span>
        {unreadCount > 0 && (
          <span 
            className="notification-badge"
            style={{
              background: 'red',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="notifications-dropdown"
          style={{
            border: '3px solid green',
            background: 'white'
          }}
        >
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mark-all-read-btn"
                >
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
                    border: '1px solid #ccc',
                    margin: '5px',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
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