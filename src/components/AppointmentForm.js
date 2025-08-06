import React, { useState } from 'react';
import { createAppointment } from '../api/appointments';

export default function AppointmentForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createAppointment(formData);
    onAdd(response.data);
    setFormData({ name: '', email: '', date: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Book an Appointment</h3>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
}
