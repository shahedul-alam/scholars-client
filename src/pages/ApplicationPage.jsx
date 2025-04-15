import axios from "axios";
import { useLoaderData } from "react-router";
import ApplicationForm from "../components/applicationPage/applicationForm";

const ApplicationPage = () => {
  const data = useLoaderData();

  return (
    <main>
      <ApplicationForm data={data} />
    </main>
  );
};

export default ApplicationPage;

export const scholarshipAndUserLoader = async ({ params }) => {
  try {
    const result = await axios.get(
      `http://localhost:5000/scholarship-user?paymentId=${params.id}`
    );

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
