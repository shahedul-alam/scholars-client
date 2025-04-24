import { useLoaderData } from "react-router";
import UpdateApplicationForm from "../components/updateApplicationPage/UpdateApplicationForm";
import { axiosPublic } from "../hooks/useAxiosSecure";

const UpdateApplicationPage = () => {
  const data = useLoaderData();

  return (
    <main>
      <UpdateApplicationForm data={data} />
    </main>
  );
};

export default UpdateApplicationPage;

export const applicationLoader = async ({ params }) => {
  try {
    const result = await axiosPublic.get(`/applications/${params.id}`);

    return result.data.data;
  } catch (error) {
    if (error.response) {
      // Handle different status codes
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data.message);
        case 404:
          throw new Error(error.response.data.message);
        default:
          throw new Error("Something went wrong!");
      }
    }
    throw error;
  }
};
