import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { signoutUser, errorToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // signing out user for unauthorized and forbidden access
          await signoutUser();
          // navigating to the user to the login page
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  return axiosInstance;
};

export default useAxiosSecure;
