import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Loading from "../../shared/Loading";
import Swal from "sweetalert2";
import { deleteReview } from "../../utilities/utilities";

// API request with proper error handling
const fetchAllUserReviews = async (email) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/reviews?email=${email}`
    );
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to fetch reviews. Please try again later.");
  }
};

const ReviewRows = ({ review, handleDeleteReview }) => {
  console.log(review);
  const {
    applicationId,
    scholarshipId,
    universityName,
    reviewerComments,
    ratingPoint,
    reviewDate,
  } = review;
  const formattedDate = new Date(reviewDate).toLocaleDateString("en-GB");

  return (
    <tr>
      <td>
        <div className="font-bold">{universityName}</div>
      </td>
      <td>{reviewerComments}</td>
      <td>{ratingPoint}</td>
      <td>{formattedDate}</td>
      <td>
        <div className="space-y-2">
          <Link
            to={`/scholarships/${scholarshipId}`}
            className="btn btn-info text-white w-full"
          >
            Details
          </Link>
          <button className="btn btn-warning text-white w-full">Update</button>
          <button className="btn btn-error text-white w-full" onClick={() => handleDeleteReview(applicationId)}>Delete</button>
        </div>
      </td>
    </tr>
  );
};

const UserReviewsScreen = () => {
  const { user, successToast, errorToast } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: () => fetchAllUserReviews(user?.email),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!user?.email, // Only run query if we have user email
  });

  const handleDeleteReview = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteReview(id);
          successToast(res.message);
          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "Your review has been deleted.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to delete review";
          errorToast(errorMessage);
        }
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.length) {
    return (
      <div className="grow flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-montserrat font-bold mb-4">
          No Reviews Found
        </h2>
        <p className="font-hind mb-6">
          You haven't posted any reviews yet.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-x-auto grow px-4 md:px-0">
      <h2 className="text-2xl font-montserrat font-bold mb-6">Your Reviews</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="font-montserrat">
            <tr>
              <th>University Name</th>
              <th>Review Comment</th>
              <th>Review Rating</th>
              <th>Review Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((item) => (
              <ReviewRows
                key={item.review.applicationId}
                review={item.review}
                handleDeleteReview={handleDeleteReview}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserReviewsScreen;
