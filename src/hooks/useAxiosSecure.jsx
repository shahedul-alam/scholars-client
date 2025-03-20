import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const useAxiosSecure = () => {
  return (
    <div>
      
    </div>
  );
};

export default useAxiosSecure;