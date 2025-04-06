import axios from "axios";

export const addUser = async (data) => {
  const response = await axios.post("http://localhost:5000/add-user", data);

  return response.data;
};

export const getUser = async (user) => {
  const { email } = user;
  
  const response = await axios.get(
    `http://localhost:5000/get-user?email=${email}`
  );

  return response.data;
};
