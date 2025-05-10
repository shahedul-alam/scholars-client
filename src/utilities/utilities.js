import { axiosPublic } from "../hooks/useAxiosSecure";

export const addUser = async (data) => {
  const response = await axiosPublic.post(
    "https://scholars-server-nu.vercel.app/add-user",
    data
  );

  return response.data;
};

export const getUser = async (user) => {
  const { email } = user;

  const response = await axiosPublic.get(
    `https://scholars-server-nu.vercel.app/get-user?email=${email}`
  );

  return response.data;
};

export const cancelApplication = async (id) => {
  const response = await axiosPublic.delete(
    `https://scholars-server-nu.vercel.app/applications/${id}`
  );

  return response.data;
};

export const postReview = async (reviewDetails) => {
  const response = await axiosPublic.post(
    `https://scholars-server-nu.vercel.app/review`,
    reviewDetails
  );

  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosPublic.delete(
    `https://scholars-server-nu.vercel.app/review/?applicationId=${id}`
  );

  return response.data;
};

export const updateReview = async (id, updatedReviewInfo) => {
  const response = await axiosPublic.patch(
    `https://scholars-server-nu.vercel.app/review/?applicationId=${id}`,
    updatedReviewInfo
  );

  return response.data;
};
