import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'appointment': '📅',
      'prescription': '💊',
      'reminder': '⏰',
      'system': '🔔',
      'medical': '🏥',
      'payment': '💳'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      'appointment': 'bg-blue-100 text-blue-800',
      'prescription': 'bg-green-100 text-green-800',
      'reminder': 'bg-yellow-100 text-yellow-800',
      'system': 'bg-purple-100 text-purple-800',
      'medical': 'bg-red-100 text-red-800',
      'payment': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount} unread of {notifications.length} total notifications
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "You're all caught up! No notifications at the moment."
                : `No ${filter} notifications found.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-600">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getNotificationColor(notification.type)}`}>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {!notification.is_read && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {notification.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                      <span>{new Date(notification.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        title="Mark as read"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      title="Delete notification"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Notification Settings</h3>
        <div className="flex space-x-4">
          <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 text-sm">
            Email Preferences
          </button>
          <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 text-sm">
            Push Notifications
          </button>
          <button className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 text-sm">
            SMS Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;