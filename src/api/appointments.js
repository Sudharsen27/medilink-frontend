import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/appointments",
});

// ✅ Automatically attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===== Appointments API =====

// Normal user: get own appointments
export const fetchAppointments = () => API.get("/");

// Admin: get all appointments
export const fetchAllAppointments = () => API.get("/all");

// Create appointment
export const createAppointment = (appointment) => API.post("/", appointment);

// Delete appointment
export const deleteAppointment = (id) => API.delete(`/${id}`);

// Update appointment
export const updateAppointment = (id, data) => API.put(`/${id}`, data);

// Update appointment status (admin only)
export const updateAppointmentStatus = (id, status) =>
  API.patch(`/${id}/status`, { status });
