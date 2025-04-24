import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../shared/Loading";
import { useEffect, useRef } from "react";

const ModeratorRoute = ({ children }) => {
  const { dbUser, loading, errorToast } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading && dbUser?.role !== "moderator" && !hasShownToast.current) {
      errorToast("You are not authorized to access that page.");
      hasShownToast.current = true;
    }
  }, [loading, dbUser, errorToast]);

  if (loading) return <Loading />;

  if (dbUser?.role === "moderator") return children;

  return <Navigate to="/" replace />;
};

export default ModeratorRoute;
