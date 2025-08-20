import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/appointments",
});

// Automatically attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Normal user: get own appointments
export const fetchAppointments = () => API.get("/");

// Admin: get all appointments
export const fetchAllAppointments = () => API.get("/all");

// Create appointment
export const createAppointment = (appointment) => API.post("/", appointment);
