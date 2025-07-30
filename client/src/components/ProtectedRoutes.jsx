import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, role } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};

// ✅ Protect Super Admin routes
export const SuperAdminRoute = ({ children }) => {
  const { role, isAuthenticated } = useSelector((store) => store.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== "superAdmin") {
    return <Navigate to="/" />;
  }

  return children;
};

// ✅ Protect Super Admin Dashboard routes (ensures superAdmin can only access their own data)
export const SuperAdminDashboardRoute = ({ children }) => {
  const { role, isAuthenticated, user } = useSelector((store) => store.auth);
  const { superAdminId } = useParams();

  console.log('🔍 SuperAdminDashboardRoute Debug:', {
    isAuthenticated,
    role,
    userId: user?._id,
    superAdminId,
    userMatch: user?._id === superAdminId
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== "superAdmin") {
    return <Navigate to="/" />;
  }

  // Check if superAdmin is accessing their own dashboard
  if (user?._id !== superAdminId) {
    console.log('❌ SuperAdmin trying to access another dashboard');
    return <Navigate to="/" />;
  }

  console.log('✅ SuperAdmin dashboard access granted');
  return children;
};
