// src/routes/ProtectedRoutes.jsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const SuperAdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/super-admin/login" />;
  if (user?.role !== "superadmin") return <Navigate to="/" />;

  return children;
};

