import client, { unwrap } from "./client";

export const fetchAppointmentById = async (id) => {
  const res = await client.get(`/api/appointments/${id}`);
  return unwrap(res);
};

const normalizeAppointment = (row) => ({
  ...row,
  appointment_date: row.appointment_date || row.date,
  appointment_time: row.appointment_time || row.time,
  doctor_specialization: row.doctor_specialization || "General Practice",
});

const isTelemedicineCandidate = (appointment) => {
  const status = String(appointment.status || "").toLowerCase();
  const type = String(appointment.appointment_type || "").toLowerCase();
  const excluded = new Set(["cancelled", "completed", "no_show"]);

  if (excluded.has(status)) return false;
  if (type === "telemedicine" || type === "video") return true;
  return [
    "scheduled",
    "confirmed",
    "in-progress",
    "pending",
    "reschedule_requested",
  ].includes(status);
};

export const fetchTelemedicineAppointments = async () => {
  const res = await client.get("/api/appointments");
  const rows = Array.isArray(res.data) ? res.data : unwrap(res) || [];
  return rows
    .filter(isTelemedicineCandidate)
    .map(normalizeAppointment)
    .sort((a, b) => {
      const da = new Date(a.appointment_date || a.date || 0).getTime();
      const db = new Date(b.appointment_date || b.date || 0).getTime();
      return da - db;
    });
};

export const startConsultation = async (appointmentId) => {
  const res = await client.post(`/api/telemedicine/${appointmentId}/start`);
  return res.data;
};

export const endConsultation = async (appointmentId, { duration, notes } = {}) => {
  const res = await client.post(`/api/telemedicine/${appointmentId}/end`, {
    duration,
    notes,
  });
  return res.data;
};

export const fetchConsultation = async (appointmentId) => {
  const res = await client.get(`/api/telemedicine/${appointmentId}`);
  return res.data;
};

export const fetchChatHistory = async (appointmentId) => {
  const res = await client.get(`/api/telemedicine/${appointmentId}/chat`);
  return Array.isArray(res.data) ? res.data : unwrap(res) || [];
};

export const sendChatMessage = async (appointmentId, message, senderType = "patient") => {
  const res = await client.post(`/api/telemedicine/${appointmentId}/chat`, {
    message,
    sender_type: senderType,
  });
  return unwrap(res);
};
