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

export const cancelApplication = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/applications/${id}`
  );

  return response.data;
};

export const postReview = async (reviewDetails) => {
  const response = await axios.post(`http://localhost:5000/review`, reviewDetails);

  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/review/?applicationId=${id}`
  );

  return response.data;
};


