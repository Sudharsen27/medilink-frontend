import axios from "axios";
import { apiUrl } from "../config/api";

const API = axios.create({
  baseURL: apiUrl("/api/appointments"),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAppointments = async () => {
  const res = await API.get("/");
  return res.data;
};

export const fetchAllAppointments = async () => {
  const res = await API.get("/all");
  return res.data;
};

export const createAppointment = async (data) => {
  const res = await API.post("/", data);
  return res.data;
};

export const updateAppointment = async (id, data) => {
  const res = await API.put(`/${id}`, data);
  return res.data;
};

export const deleteAppointment = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await API.patch(`/${id}/status`, { status });
  return res.data;
};

export default API;
