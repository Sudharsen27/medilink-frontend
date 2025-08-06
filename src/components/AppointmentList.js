import React from 'react';

export default function AppointmentList({ appointments }) {
  return (
    <div>
      <h3>All Appointments</h3>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            {app.name} - {app.email} - {new Date(app.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
