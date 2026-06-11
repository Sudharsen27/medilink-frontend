import { apiUrl } from "../config/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchAdminAnalytics = async () => {
  const res = await fetch(apiUrl("/api/admin/analytics"), {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load admin analytics");
  }

  return res.json();
};

export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
