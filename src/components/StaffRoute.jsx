import { Navigate } from "react-router-dom";

const STAFF_ROLES = new Set(["doctor", "admin"]);

const StaffRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!STAFF_ROLES.has(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default StaffRoute;
