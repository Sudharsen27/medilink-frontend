// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/appointments",
// });

// // ✅ Automatically attach token to requests
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // ===== Appointments API =====

// // Normal user: get own appointments
// export const fetchAppointments = () => API.get("/");

// // Admin: get all appointments
// export const fetchAllAppointments = () => API.get("/all");

// // Create appointment
// export const createAppointment = (appointment) => API.post("/", appointment);

// // Delete appointment
// export const deleteAppointment = (id) => API.delete(`/${id}`);

// // Update appointment
// export const updateAppointment = (id, data) => API.put(`/${id}`, data);

// // Update appointment status (admin only)
// export const updateAppointmentStatus = (id, status) =>
//   API.patch(`/${id}/status`, { status });


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/appointments",
});

// 🔐 Attach JWT token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Appointments API
// ===============================

// Normal user: get own appointments
export const fetchAppointments = () => API.get("/");

// Admin: get all appointments
export const fetchAllAppointments = () => API.get("/all");

// Create appointment
export const createAppointment = (appointment) =>
  API.post("/", appointment);

// ❗ DELETE appointment
// 🔴 CHANGE PATH HERE IF BACKEND DIFFERS
export const deleteAppointment = (id) => {
  console.log("API delete appointment ID:", id);
  return API.delete(`/${id}`);
};

// Update full appointment
export const updateAppointment = (id, data) =>
  API.put(`/${id}`, data);

// Update appointment status
// 🔴 CHANGE PATH HERE IF BACKEND DIFFERS
export const updateAppointmentStatus = (id, status) => {
  console.log("API update status:", id, status);
  return API.patch(`/${id}/status`, { status });
};
