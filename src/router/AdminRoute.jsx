import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../shared/Loading";
import { useEffect, useRef } from "react";

const AdminRoute = ({ children }) => {
  const { dbUser, loading, errorToast } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (dbUser?.role !== "admin" && !hasShownToast.current) {
      errorToast("You are not authorized to access that page.");
      hasShownToast.current = true;
    }
  }, [dbUser, errorToast]);

  if (!dbUser || loading) return <Loading />;

  if (dbUser?.role === "admin") return children;

  return <Navigate to="/" replace />;
};

export default AdminRoute;
