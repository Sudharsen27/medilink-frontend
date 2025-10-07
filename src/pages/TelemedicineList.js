import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TelemedicineList = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for testing
    const mockAppointments = [
      {
        id: 1,
        doctor_name: "Dr. Sarah Johnson",
        doctor_specialization: "Cardiology",
        appointment_date: new Date().toISOString().split('T')[0], // Today
        appointment_time: "14:30",
        reason: "Heart palpitations follow-up",
        status: "scheduled"
      },
      {
        id: 2,
        doctor_name: "Dr. Michael Chen",
        doctor_specialization: "Dermatology",
        appointment_date: "2024-01-20",
        appointment_time: "10:00",
        reason: "Skin rash consultation",
        status: "scheduled"
      }
    ];
    
    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Telemedicine Consultations</h1>
        <Link
          to="/doctors"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Book New Appointment
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎥</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Telemedicine Appointments
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have any telemedicine appointments scheduled.
            </p>
            <Link
              to="/doctors"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div key={appointment.id} className="border dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">DR</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {appointment.doctor_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{appointment.doctor_specialization}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>📅 {new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        <span>⏰ {appointment.appointment_time}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Link
                      to={`/telemedicine/${appointment.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
                    >
                      Join Consultation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Help Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">How Telemedicine Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Book Appointment</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Schedule with a doctor for telemedicine</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Join Call</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Join 15 minutes before your scheduled time</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200">Get Treatment</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">Consult with doctor and receive prescription</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedicineList;