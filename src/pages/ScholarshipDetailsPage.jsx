import { useLoaderData } from "react-router";
import ScholarshipDetails from "../components/scholarshipDetailsPage/ScholarshipDetails";
import Frequently from "../components/homepage/Frequently";
import UserReviews from "../components/scholarshipDetailsPage/UserReviews";
import { axiosPublic } from "../hooks/useAxiosSecure";

const ScholarshipDetailsPage = () => {
  const data = useLoaderData();

  return (
    <main>
      <ScholarshipDetails data={data} />
      <UserReviews data={data.reviews} />
      <Frequently />
    </main>
  );
};

export default ScholarshipDetailsPage;

export const scholarshipDetailsLoader = async ({ params }) => {
  try {
    const result = await axiosPublic.get(`/scholarship/${params.id}`);

    return result.data.data;
  } catch (error) {
    if (error.response) {
      // Handle different status codes
      switch (error.response.status) {
        case 400:
          throw new Error("Invalid scholarship ID");
        case 404:
          throw new Error("Scholarship not found");
        default:
          throw new Error("Something went wrong!");
      }
    }
    throw error;
  }
};
