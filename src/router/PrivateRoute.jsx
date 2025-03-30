import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";


const PrivateRoute = ({children}) => {
  const {user, loading} = useAuth();
  const {pathname} = useLocation();

  if(loading) {
    return <Loading />;
  }

  if(user) {
    return children;
  }

  return <Navigate to={'/login'} replace={true} state={pathname} />;
};

export default PrivateRoute;