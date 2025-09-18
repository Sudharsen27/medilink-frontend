import React, { useState } from "react";
import axios from "axios";

export default function AppointmentForm({ onAdd }) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    date: "",
    time: "",
    whatsappOptIn: false,
  });

  // Today’s date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ You must be logged in to book an appointment");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ Send token
          },
        }
      );

      if (onAdd) onAdd(response.data);
      alert("✅ Appointment booked successfully! WhatsApp reminder will be sent.");

      // Reset form
      setFormData({
        patientName: "",
        patientPhone: "",
        doctorName: "",
        date: "",
        time: "",
        whatsappOptIn: false,
      });
    } catch (err) {
      console.error(
        "Failed to create appointment:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.error || "❌ Failed to create appointment");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "450px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #cce3d2",
        borderRadius: "12px",
        backgroundColor: "#f6fff9",
        boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#2e7d32",
          textAlign: "center",
          marginBottom: "15px",
          fontWeight: "bold",
        }}
      >
        Book an Appointment
      </h2>

      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
        }}
      />

      <input
        type="text"
        name="patientPhone"
        placeholder="Phone Number (e.g. +919876543210)"
        value={formData.patientPhone}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
        }}
      />

      <input
        type="text"
        name="doctorName"
        placeholder="Doctor Name"
        value={formData.doctorName}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
        }}
      />

      <input
        type="date"
        name="date"
        min={today}
        value={formData.date}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
        }}
      />

      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
          borderRadius: "8px",
          border: "1px solid #a5d6a7",
        }}
      />

      <label
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
        <input
          type="checkbox"
          name="whatsappOptIn"
          checked={formData.whatsappOptIn}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />
        Send me WhatsApp reminders
      </label>

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
          fontSize: "16px",
        }}
      >
        Submit
      </button>
    </form>
  );
}
