import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles, allowedDepartments }) => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  // If no user, logout and redirect
  if (!user && window.location.pathname !== "/logout") {
    return <Navigate to="/login" />;
  }

  // ✅ Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    logout?.();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Department check
  if (allowedDepartments && !allowedDepartments.includes(user.department)) {
    logout?.();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
