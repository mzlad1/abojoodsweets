import { Navigate } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
