

import React, { useState } from "react";
import axios from "axios";
import SmartBooking from "./SmartBooking"; // ✅ Smart Slots
import { useCaregiver } from "../context/CaregiverContext"; // ✅ Caregiver Mode

export default function AppointmentForm({ onAdd }) {
  // 🧠 Active person (self / dependent)
  const { activePerson } = useCaregiver();

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    doctorId: 1, // ⚠️ Replace later with real doctor selection
    date: "",
    time: "",
    whatsappOptIn: false,
  });

  const [useSmartSlots, setUseSmartSlots] = useState(true);

  // Today’s date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  /* ----------------
     Handlers
  ----------------- */
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ You must be logged in to book an appointment");
        return;
      }

      // ✅ Attach caregiver info
      const payload = {
        ...formData,
        patient_type: activePerson.type,           // self | dependent
        patient_id:
          activePerson.type === "dependent" ? activePerson.id : null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onAdd) onAdd(response.data);

      alert(
        `✅ Appointment booked for ${
          activePerson.type === "self" ? "yourself" : activePerson.name
        }`
      );

      // Reset
      setFormData({
        patientName: "",
        patientPhone: "",
        doctorName: "",
        doctorId: 1,
        date: "",
        time: "",
        whatsappOptIn: false,
      });
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert(err.response?.data?.error || "❌ Failed to create appointment");
    }
  };

  /* ----------------
     UI
  ----------------- */
  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h2 style={titleStyle}>
        Book Appointment for{" "}
        <span style={{ color: "#1b5e20" }}>
          {activePerson.type === "self" ? "Myself" : activePerson.name}
        </span>
      </h2>

      {/* Patient Name */}
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* Phone */}
      <input
        type="text"
        name="patientPhone"
        placeholder="Phone Number"
        value={formData.patientPhone}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* Doctor Name */}
      <input
        type="text"
        name="doctorName"
        placeholder="Doctor Name"
        value={formData.doctorName}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* Date */}
      <input
        type="date"
        name="date"
        min={today}
        value={formData.date}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* Smart Slot Toggle */}
      <label style={checkboxStyle}>
        <input
          type="checkbox"
          checked={useSmartSlots}
          onChange={() => setUseSmartSlots(!useSmartSlots)}
          style={{ marginRight: "8px" }}
        />
        Use Smart Slot Suggestions
      </label>

      {/* Smart Booking */}
      {useSmartSlots && (
        <SmartBooking
          doctorId={formData.doctorId}
          onConfirm={(time) =>
            setFormData((prev) => ({ ...prev, time }))
          }
        />
      )}

      {/* Time */}
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
        style={inputStyle}
      />

      {/* WhatsApp */}
      <label style={checkboxStyle}>
        <input
          type="checkbox"
          name="whatsappOptIn"
          checked={formData.whatsappOptIn}
          onChange={handleChange}
          style={{ marginRight: "8px" }}
        />
        Send WhatsApp reminders
      </label>

      {/* Submit */}
      <button type="submit" style={submitStyle}>
        Book Appointment
      </button>
    </form>
  );
}

/* ----------------
   Styles
----------------- */
const containerStyle = {
  maxWidth: "450px",
  margin: "20px auto",
  padding: "20px",
  border: "1px solid #cce3d2",
  borderRadius: "12px",
  backgroundColor: "#f6fff9",
  boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
  fontFamily: "Arial, sans-serif",
};

const titleStyle = {
  color: "#2e7d32",
  textAlign: "center",
  marginBottom: "15px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #a5d6a7",
};

const checkboxStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
};

const submitStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#66bb6a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};
