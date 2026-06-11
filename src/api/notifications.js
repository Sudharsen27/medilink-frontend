import { apiUrl } from "../config/api";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchNotificationsPage = async ({
  page = 1,
  limit = 15,
  search = "",
  types = null,
  read = "all",
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) params.set("search", search.trim());
  if (types?.length) params.set("types", types.join(","));
  if (read === "read") params.set("read", "true");
  if (read === "unread") params.set("read", "false");

  const res = await fetch(`${apiUrl("/api/notifications")}?${params}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load notifications");

  const payload = await res.json();
  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
      hasMore: false,
    };
  }

  return {
    data: payload.data ?? [],
    total: payload.total ?? 0,
    page: payload.page ?? page,
    limit: payload.limit ?? limit,
    hasMore: Boolean(payload.hasMore),
  };
};

export const fetchAllNotifications = async () => {
  const res = await fetch(apiUrl("/api/notifications"), {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load notifications");
  const payload = await res.json();
  return Array.isArray(payload) ? payload : payload.data ?? [];
};

export const markNotificationRead = async (id) => {
  const res = await fetch(apiUrl(`/api/notifications/${id}/read`), {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
};

export const markAllNotificationsRead = async () => {
  const res = await fetch(apiUrl("/api/notifications/read-all"), {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
};

export const deleteNotificationById = async (id) => {
  const res = await fetch(apiUrl(`/api/notifications/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete notification");
  return res.json();
};
