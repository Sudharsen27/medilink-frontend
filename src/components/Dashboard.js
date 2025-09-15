// src/components/Dashboard.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import { fetchAppointments, fetchAllAppointments } from '../api/appointments';
import Avatar from './Avatar';
import ActivityFeed from './ActivityFeed';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import DateRangePicker from './DateRangePicker';
import ExportButton from './ExportButton';
import NotificationBell from './NotificationBell';
import UserMenu from './UserMenu';

const Dashboard = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    
    return { total, pending, confirmed, cancelled };
  }, [appointments]);

  // Mock activities data - in a real app, this would come from an API
  const activities = useMemo(() => [
    { id: 1, userName: 'Dr. Smith', userAvatar: '', action: 'Booked an appointment', time: '2m ago' },
    { id: 2, userName: 'Patient John', userAvatar: '', action: 'Cancelled an appointment', time: '10m ago' },
    { id: 3, userName: 'Nurse Sarah', userAvatar: '', action: 'Updated patient records', time: '15m ago' },
    { id: 4, userName: 'Dr. Johnson', userAvatar: '', action: 'Completed a consultation', time: '30m ago' }
  ], []);

  // Mock notifications data
  const mockNotifications = useMemo(() => [
    { id: 1, message: 'New appointment request from Jane Doe', type: 'info', read: false, time: '5 min ago' },
    { id: 2, message: 'Appointment with John Smith confirmed', type: 'success', read: false, time: '1 hour ago' },
    { id: 3, message: 'Reminder: Meeting at 2 PM today', type: 'warning', read: true, time: '3 hours ago' }
  ], []);

  // Load appointments based on user role
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = user?.role === 'admin' ? await fetchAllAppointments() : await fetchAppointments();
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllAppointments();
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch all appointments (Admin):', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter appointments based on search term, status filter, and date range
  useEffect(() => {
    let result = appointments;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(appt => 
        (appt.title && appt.title.toLowerCase().includes(term)) ||
        (appt.userName && appt.userName.toLowerCase().includes(term)) ||
        (appt.description && appt.description.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appt => appt.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate >= dateRange.start && apptDate <= dateRange.end;
      });
    }
    
    setFilteredAppointments(result);
  }, [appointments, searchTerm, statusFilter, dateRange]);

  // Load data on component mount and when refresh is triggered
  useEffect(() => {
    loadAppointments();
    setNotifications(mockNotifications);
  }, [loadAppointments, refreshTrigger, mockNotifications]);

  // FIXED: Remove ID generation from frontend
  const handleAddAppointment = (newAppointment) => {
    // Don't generate ID on frontend - let the backend handle it
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: null, end: null });
  };

  const StatCard = ({ title, value, color, icon, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-2xl ${color.replace('border-l-', 'text-')}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Role: <span className="font-medium capitalize">{user.role}</span></p>
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                title="Refresh data"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar onSearch={handleSearch} />
              
              <NotificationBell 
                notifications={notifications}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                onMarkAsRead={markNotificationAsRead}
              />
              
              {user?.role === 'admin' && (
                <button
                  onClick={loadAllAppointments}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View All Appointments
                </button>
              )}
              
              <UserMenu user={user} onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'appointments', name: 'Appointments', icon: '📅' },
              { id: 'new-appointment', name: 'New Appointment', icon: '➕' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats with click functionality */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Appointments" 
                value={stats.total} 
                color="border-l-blue-500" 
                icon="📅"
                onClick={() => {
                  setActiveTab('appointments');
                  clearAllFilters();
                }}
              />
              <StatCard 
                title="Pending" 
                value={stats.pending} 
                color="border-l-yellow-500" 
                icon="⏳"
                onClick={() => {
                  setActiveTab('appointments');
                  setStatusFilter('pending');
                }}
              />
              <StatCard 
                title="Confirmed" 
                value={stats.confirmed} 
                color="border-l-green-500" 
                icon="✅"
                onClick={() => {
                  setActiveTab('appointments');
                  setStatusFilter('confirmed');
                }}
              />
              <StatCard 
                title="Cancelled" 
                value={stats.cancelled} 
                color="border-l-red-500" 
                icon="❌"
                onClick={() => {
                  setActiveTab('appointments');
                  setStatusFilter('cancelled');
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => setActiveTab('new-appointment')}
                >
                  <span className="text-2xl mb-2">➕</span>
                  <span className="text-sm font-medium">New Appointment</span>
                </button>
                <button 
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  onClick={handleRefresh}
                >
                  <span className="text-2xl mb-2">🔄</span>
                  <span className="text-sm font-medium">Refresh Data</span>
                </button>
                <button 
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  onClick={() => window.print()}
                >
                  <span className="text-2xl mb-2">🖨️</span>
                  <span className="text-sm font-medium">Print Report</span>
                </button>
                <button 
                  className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  onClick={() => setShowNotifications(true)}
                >
                  <span className="text-2xl mb-2">🔔</span>
                  <span className="text-sm font-medium">Notifications</span>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                <button 
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                  onClick={() => setActiveTab('appointments')}
                >
                  View All
                </button>
              </div>
              <div className="p-6 space-y-4">
                {appointments.length ? appointments.slice(0,5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                      <Avatar name={apt.userName || apt.title || 'User'} src={apt.avatar} />
                      <div>
                        <p className="font-medium text-gray-900">{apt.title || 'Appointment'}</p>
                        <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status || 'pending'}
                    </span>
                  </div>
                )) : <p className="text-gray-500 text-center py-8">No appointments found</p>}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  See All Activity
                </button>
              </div>
              <ActivityFeed activities={activities} />
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                
                <div className="flex flex-wrap gap-2">
                  {(searchTerm || statusFilter !== 'all' || dateRange.start) && (
                    <button 
                      onClick={clearAllFilters}
                      className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Clear filters
                    </button>
                  )}
                  
                  <ExportButton data={filteredAppointments} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FilterBar onFilter={handleStatusFilter} currentFilter={statusFilter} />
                <DateRangePicker onRangeChange={handleDateRangeChange} />
                
                <div className="flex items-end">
                  <span className="text-sm text-gray-600">
                    Showing {filteredAppointments.length} of {appointments.length} appointments
                  </span>
                </div>
              </div>
            </div>
            
            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <AppointmentList 
                appointments={filteredAppointments} 
                onUpdate={loadAppointments} 
                searchTerm={searchTerm}
              />
            </div>
          </div>
        )}

        {/* New Appointment Tab */}
        {activeTab === 'new-appointment' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Create New Appointment</h2>
              <button 
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
                onClick={() => setActiveTab('appointments')}
              >
                Back to Appointments
              </button>
            </div>
            <div className="p-6">
              <AppointmentForm
                onAdd={(newAppointment) => {
                  handleAddAppointment(newAppointment);
                  setActiveTab('appointments');
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;