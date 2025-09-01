// components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import { fetchAppointments, fetchAllAppointments } from '../api/appointments';

const Dashboard = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });

  // Load appointments based on user role
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        user?.role === 'admin'
          ? await fetchAllAppointments()
          : await fetchAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Explicit admin-only loader (button)
  const loadAllAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch all appointments (Admin):', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate stats whenever appointments change
  const calculateStats = useCallback(() => {
    const total = appointments.length;
    const pending = appointments.filter((apt) => apt.status === 'pending').length;
    const confirmed = appointments.filter((apt) => apt.status === 'confirmed').length;
    const cancelled = appointments.filter((apt) => apt.status === 'cancelled').length;

    setStats({ total, pending, confirmed, cancelled });
  }, [appointments]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleAddAppointment = (newAppointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              {/* ✅ Role display */}
              <p className="text-gray-600">
                Role: <span className="font-medium capitalize">{user.role}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={loadAllAppointments}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  View All Appointments
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
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
            ].map((tab) => (
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Appointments" value={stats.total} color="border-l-blue-500" icon="📅" />
              <StatCard title="Pending" value={stats.pending} color="border-l-yellow-500" icon="⏳" />
              <StatCard title="Confirmed" value={stats.confirmed} color="border-l-green-500" icon="✅" />
              <StatCard title="Cancelled" value={stats.cancelled} color="border-l-red-500" icon="❌" />
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
              </div>
              <div className="p-6">
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appointment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.title || 'Appointment'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()} at{' '}
                            {appointment.time}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {appointment.status || 'pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No appointments found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
            </div>
            <div className="p-6">
              <AppointmentList 
  appointments={appointments} 
  onUpdate={loadAppointments} 
/>
            </div>
          </div>
        )}

        {activeTab === 'new-appointment' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Appointment</h2>
            </div>
            <div className="p-6">
              <AppointmentForm
                onAdd={(newAppointment) => {
                  handleAddAppointment(newAppointment);
                  setActiveTab('appointments'); // Switch to appointments tab after adding
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
