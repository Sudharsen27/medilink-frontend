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

  // Merged handleSubmit with error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createAppointment(formData);
      onAdd(response.data);
      setFormData({ name: '', email: '', date: '' });
    } catch (err) {
      console.error("Failed to create appointment:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to create appointment");
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #cce3d2",
        borderRadius: "12px",
        backgroundColor: "#f6fff9",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <h3 style={{ color: "#2e7d32", textAlign: "center", marginBottom: "15px" }}>
        Book an Appointment
      </h3>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
          outline: "none"
        }}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
          outline: "none"
        }}
      />

      <input
        name="date"
        type="date"
        min={today}
        value={formData.date}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
          outline: "none"
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#66bb6a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        Submit
      </button>
    </form>
  );
}
