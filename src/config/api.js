export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_URL = `${API_BASE_URL}/api`;

/**
 * Build a full backend URL for API routes or static assets.
 * Examples:
 *   apiUrl("/api/auth/login") -> http://localhost:5000/api/auth/login
 *   apiUrl("/health")         -> http://localhost:5000/health
 *   apiUrl("appointments")    -> http://localhost:5000/api/appointments
 */
export const apiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("/api")) {
    return `${API_BASE_URL}${normalized}`;
  }
  return `${API_URL}${normalized}`;
};
