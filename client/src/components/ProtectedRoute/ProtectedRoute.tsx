import {
  Navigate,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const context = useOutletContext();

  if (isLoading) return null;

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`;

    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet context={context} />;
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/knowledge" replace /> : <Outlet />;
}
