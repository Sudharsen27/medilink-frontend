import React from 'react';
import { Link } from 'react-router-dom';

const TelemedicineCard = ({ appointment }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canStartCall = () => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const fifteenMinutesBefore = new Date(appointmentDateTime.getTime() - 15 * 60000);
    const oneHourAfter = new Date(appointmentDateTime.getTime() + 60 * 60000);
    
    return now >= fifteenMinutesBefore && now <= oneHourAfter && appointment.status === 'scheduled';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={appointment.doctor_photo_url || '/api/placeholder/50/50'}
              alt={appointment.doctor_name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-lg">Dr. {appointment.doctor_name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{appointment.doctor_specialization}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.appointment_time}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {appointment.type}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status.replace('-', ' ')}
          </span>
          
          {canStartCall() && (
            <Link
              to={`/telemedicine/${appointment.id}`}
              className="mt-3 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Join Consultation
            </Link>
          )}
          
          {appointment.status === 'completed' && (
            <Link
              to={`/prescriptions?appointment=${appointment.id}`}
              className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Prescription
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemedicineCard;