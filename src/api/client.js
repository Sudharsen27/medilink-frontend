import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { unwrap } from "../lib/unwrapApi";

export { unwrap };

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    const enriched = new Error(message);
    enriched.status = error.response?.status;
    enriched.data = error.response?.data;
    return Promise.reject(enriched);
  }
);

export default client;
