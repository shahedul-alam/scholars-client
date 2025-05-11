import { axiosPublic } from "../hooks/useAxiosSecure";

export const addUser = async (data) => {
  const response = await axiosPublic.post("/add-user", data);

  return response.data;
};

export const getUser = async (user) => {
  const { email } = user;

  const response = await axiosPublic.get(`/get-user?email=${email}`);

  return response.data;
};

export const cancelApplication = async (id) => {
  const response = await axiosPublic.delete(`/applications/${id}`);

  return response.data;
};

export const postReview = async (reviewDetails) => {
  const response = await axiosPublic.post(`/review`, reviewDetails);

  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosPublic.delete(`/review/?applicationId=${id}`);

  return response.data;
};

export const updateReview = async (id, updatedReviewInfo) => {
  const response = await axiosPublic.patch(
    `/review/?applicationId=${id}`,
    updatedReviewInfo
  );

  return response.data;
};
