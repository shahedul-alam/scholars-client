import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import ErrorState from "../../shared/ErrorState";
import EmptyState from "../../shared/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Swal from "sweetalert2";

const fetchAllReviews = async (email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await axiosSecure.get(
      `/all-reviews-moderator?email=${email}`
    );

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to fetch scholarships. Please try again later.");
  }
};

const deleteReview = async (applicationId, email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  if (!applicationId) throw new Error("Application ID is required");

  try {
    const response = await axiosSecure.delete(
      `/reviews-moderator/${applicationId}?email=${email}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to delete review. Please try again later.");
  }
};

const ReviewsRows = ({ review, handleDeleteReview }) => {
  const {
    applicationId,
    universityName,
    reviewerName,
    reviewerImage,
    reviewerComments,
    reviewDate,
    ratingPoint,
  } = review;

  const formattedDate = new Date(reviewDate).toLocaleDateString("en-GB");

  return (
    <tr className="hover:bg-base-200">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={reviewerImage} alt={`${reviewerName} photo`} />
            </div>
          </div>
          <div>
            <div className="font-bold">{reviewerName}</div>
          </div>
        </div>
      </td>
      <td>{universityName}</td>
      <td>{formattedDate}</td>
      <td>
        <div className="flex items-center">
          <span className="font-medium mr-1">{ratingPoint}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-500 inline"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
      </td>
      <td>{reviewerComments}</td>
      <td>
        <button
          className="btn btn-error text-white"
          onClick={() => handleDeleteReview(applicationId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const ModeratorAllReviews = () => {
  const { user, dbUser, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: () => fetchAllReviews(user?.email, axiosSecure),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: !!dbUser?.role,
    retry: 1,
  });

  console.log(data);

  useEffect(() => {
    // Only refetch if we have a user email
    if (dbUser?.role === "moderator") {
      refetch();
    }
  }, [dbUser?.role, refetch]);

  const handleDeleteReview = (applicationId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteReview(
            applicationId,
            user?.email,
            axiosSecure
          );
          successToast(res.message);
          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "review has been deleted.",
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

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Reviews"
        message={error.message}
        actionLabel="Try again"
        action={refetch}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No Reviews Found"
        message="Nobody haven't posted any reviews yet."
        actionLabel="Browse Scholarships"
        actionLink="/all-scholarship"
      />
    );
  }

  console.log(data);

  return (
    <section className="overflow-x-auto grow p-4">
      <h2 className="text-2xl font-montserrat font-bold mb-6">
        All Reviews ({data.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="font-montserrat">
            <tr>
              <th>Reviewer</th>
              <th>University Name</th>
              <th>Review Date</th>
              <th>Rating Point</th>
              <th>Reviewer Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((review, index) => (
              <ReviewsRows
                key={index}
                review={review}
                handleDeleteReview={handleDeleteReview}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ModeratorAllReviews;
