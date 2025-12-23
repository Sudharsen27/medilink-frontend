

// components/Dashboard.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import { fetchAppointments, fetchAllAppointments } from '../api/appointments';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import DateRangePicker from './DateRangePicker';
import ExportButton from './ExportButton';
import NotificationBell from './NotificationBell';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import RecentAppointments from './RecentAppointments';
import HealthCheck from './HealthCheck';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
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
  const { addToast } = useToast();

  // Memoized statistics calculation
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    
    return { total, pending, confirmed, cancelled, completed };
  }, [appointments]);

  // Mock notifications data
  // const mockNotifications = useMemo(() => [
  //   { 
  //     id: 1, 
  //     message: 'New appointment request from Jane Doe', 
  //     type: 'info', 
  //     read: false, 
  //     time: '5 min ago',
  //     action: () => setActiveTab('appointments')
  //   },
  //   { 
  //     id: 2, 
  //     message: 'Appointment with John Smith confirmed', 
  //     type: 'success', 
  //     read: false, 
  //     time: '1 hour ago',
  //     action: () => setActiveTab('appointments')
  //   },
  //   { 
  //     id: 3, 
  //     message: 'Reminder: Meeting at 2 PM today', 
  //     type: 'warning', 
  //     read: true, 
  //     time: '3 hours ago',
  //     action: () => setActiveTab('appointments')
  //   }
  // ], []);

  // Load appointments based on user role
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = user?.role === 'admin' 
        ? await fetchAllAppointments() 
        : await fetchAppointments();
      
      setAppointments(response.data);
      addToast('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, addToast]);

  // Filter appointments based on filters
  useEffect(() => {
    let result = appointments;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(appt => 
        (appt.title?.toLowerCase().includes(term)) ||
        (appt.userName?.toLowerCase().includes(term)) ||
        (appt.description?.toLowerCase().includes(term)) ||
        (appt.doctorName?.toLowerCase().includes(term))
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(appt => appt.status === statusFilter);
    }
    
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
    // setNotifications(mockNotifications);
  }, [loadAppointments, refreshTrigger, ]);

  // Event handlers
  const handleAddAppointment = useCallback((newAppointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
    addToast('Appointment created successfully', 'success');
  }, [addToast]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: null, end: null });
    addToast('Filters cleared', 'info');
  }, [addToast]);

  // Quick action handlers
  const handleQuickAction = useCallback((action) => {
    switch (action) {
      case 'new-appointment':
        setActiveTab('new-appointment');
        break;
      case 'refresh':
        handleRefresh();
        break;
      case 'print':
        window.print();
        break;
      case 'notifications':
        setShowNotifications(true);
        break;
      default:
        break;
    }
  }, [handleRefresh]);

  // Stats card click handlers
  const handleStatClick = useCallback((type) => {
    setActiveTab('appointments');
    switch (type) {
      case 'total':
        clearAllFilters();
        break;
      case 'pending':
        setStatusFilter('pending');
        break;
      case 'confirmed':
        setStatusFilter('confirmed');
        break;
      case 'cancelled':
        setStatusFilter('cancelled');
        break;
      case 'completed':
        setStatusFilter('completed');
        break;
      default:
        clearAllFilters();
    }
  }, [clearAllFilters]);

  // Tab configuration
  const tabs = useMemo(() => [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'new-appointment', name: 'New Appointment', icon: '➕' }
  ], []);

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Role: <span className="font-medium capitalize text-blue-600 dark:text-blue-400">{user.role}</span>
                </p>
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Refresh data"
                disabled={loading}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Right Section */}
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
  onClick={() => {
    loadAppointments();
    navigate('/appointments');
  }}
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
>
  {loading ? 'Loading...' : 'View All Appointments'}
</button>

              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
          <div className="space-y-8 animate-fadeIn">
          
            {/* Statistics Cards */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatsCard 
                title="Total Appointments" 
                value={stats.total} 
                color="blue"
                icon="📅"
                trend={5}
                onClick={() => handleStatClick('total')}
              />
              <StatsCard 
                title="Pending" 
                value={stats.pending} 
                color="yellow"
                icon="⏳"
                trend={2}
                onClick={() => handleStatClick('pending')}
              />
              <StatsCard 
                title="Confirmed" 
                value={stats.confirmed} 
                color="green"
                icon="✅"
                trend={8}
                onClick={() => handleStatClick('confirmed')}
              />
              <StatsCard 
                title="Completed" 
                value={stats.completed} 
                color="purple"
                icon="🎯"
                trend={12}
                onClick={() => handleStatClick('completed')}
              />
              <StatsCard 
                title="Cancelled" 
                value={stats.cancelled} 
                color="red"
                icon="❌"
                trend={-3}
                onClick={() => handleStatClick('cancelled')}
              />
            </div>

            {/* Quick Actions */}
            <QuickActions 
              onAction={handleQuickAction}
              unreadNotifications={notifications.filter(n => !n.read).length}
            />

            {/* Recent Appointments */}
            <RecentAppointments 
              appointments={appointments}
              onViewAll={() => setActiveTab('appointments')}
            />
            <HealthCheck />  
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Appointments Management
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Manage and track all your appointments
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {(searchTerm || statusFilter !== 'all' || dateRange.start) && (
                    <button 
                      onClick={clearAllFilters}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear filters
                    </button>
                  )}
                  
                  <ExportButton data={filteredAppointments} />
                  
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAppointments.length} of {appointments.length} appointments
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FilterBar onFilter={handleStatusFilter} currentFilter={statusFilter} />
                <DateRangePicker onRangeChange={handleDateRangeChange} />
                <div className="flex items-end">
                  <button
                    onClick={handleRefresh}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
            
            {/* Appointments List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <AppointmentList 
                appointments={filteredAppointments} 
                onUpdate={loadAppointments} 
                searchTerm={searchTerm}
                loading={loading}
              />
            </div>
          </div>
        )}

        {/* New Appointment Tab */}
        {activeTab === 'new-appointment' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Appointment
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Schedule a new appointment with patient details
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('appointments')}
                className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Appointments
              </button>
            </div>
            <div className="p-6">
              <AppointmentForm
                onAdd={handleAddAppointment}
                onCancel={() => setActiveTab('appointments')}
              />
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;