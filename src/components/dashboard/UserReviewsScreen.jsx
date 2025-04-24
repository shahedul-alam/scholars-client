import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { Rating } from "react-simple-star-rating";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import { deleteReview, updateReview } from "../../utilities/utilities";
import EmptyState from "../../shared/EmptyState";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ErrorState from "../../shared/ErrorState";

// API request with proper error handling
const fetchAllUserReviews = async (email, axiosSecure) => {
  if (!email) throw new Error("Email is required to fetch reviews");

  try {
    const response = await axiosSecure.get(`/reviews?email=${email}`);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      } else if (status === 401 || status === 403) {
        throw new Error("Authentication error. Please log in again.");
      } else if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
    }
    throw new Error("Failed to fetch reviews. Please try again later.");
  }
};

// Review modal component for updating reviews
const ReviewModal = ({
  modalId,
  universityName,
  initialRating,
  initialComment,
  onClose,
  onUpdate,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [reviewComment, setReviewComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(rating, reviewComment);
  };

  const isUnchanged =
    rating === initialRating && reviewComment === initialComment;
  const isValid = rating > 0 && reviewComment.trim().length > 0;

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-md">
        <h3 className="font-bold font-montserrat text-lg mb-4">
          Update Review for {universityName}
        </h3>
        <form method="dialog" className="w-full" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor={`rating-${modalId}`}
                className="font-hind font-medium block"
              >
                Rate Your Experience
              </label>
              <Rating
                id={`rating-${modalId}`}
                SVGclassName="inline"
                size={28}
                onClick={setRating}
                initialValue={rating}
                allowHover={true}
                aria-label="Rating"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`comment-${modalId}`}
                className="font-hind font-medium block"
              >
                Review Your Experience
              </label>
              <textarea
                id={`comment-${modalId}`}
                className="textarea textarea-bordered w-full h-32 placeholder:font-hind"
                placeholder="Write your detailed review here..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                aria-label="Review comments"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              aria-label="Close review dialog"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-orange hover:bg-orange-600 text-white"
              disabled={isUnchanged || !isValid}
              aria-label="Submit review"
            >
              Update Review
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

// Single review row component
const ReviewRow = ({
  review,
  onDelete,
  onUpdate,
  successToast,
  errorToast,
}) => {
  const {
    applicationId,
    scholarshipId,
    universityName,
    reviewerComments,
    ratingPoint,
    reviewDate,
  } = review;

  const modalId = `modal-${applicationId}`;
  const formattedDate = new Date(reviewDate).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const openModal = () => {
    document.getElementById(modalId).showModal();
  };

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  const handleUpdate = async (newRating, newComment) => {
    if (newRating === ratingPoint && newComment === reviewerComments) {
      errorToast("No changes detected to update!");
      return;
    }

    const updatedReviewInfo = {
      reviewerComments: newComment,
      ratingPoint: newRating,
      reviewDate: new Date().toISOString(),
    };

    try {
      const res = await onUpdate(applicationId, updatedReviewInfo);
      successToast(res.message || "Review updated successfully");
      closeModal();
    } catch (error) {
      errorToast(error.message || "Failed to update review");
    }
  };

  return (
    <tr className="hover:bg-base-200">
      <td>
        <div className="font-bold">{universityName}</div>
      </td>
      <td>
        <div className="max-w-xs line-clamp-2" title={reviewerComments}>
          {reviewerComments}
        </div>
      </td>
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
      <td>{formattedDate}</td>
      <td>
        <div className="flex flex-col gap-2">
          <Link
            to={`/scholarships/${scholarshipId}`}
            className="btn btn-info btn-sm text-white w-full"
          >
            Details
          </Link>
          <button
            className="btn btn-warning btn-sm text-white w-full"
            onClick={openModal}
          >
            Update
          </button>
          <button
            className="btn btn-error btn-sm text-white w-full"
            onClick={() => onDelete(applicationId)}
          >
            Delete
          </button>
        </div>

        <ReviewModal
          modalId={modalId}
          universityName={universityName}
          initialRating={ratingPoint}
          initialComment={reviewerComments}
          onClose={closeModal}
          onUpdate={handleUpdate}
        />
      </td>
    </tr>
  );
};

const UserReviewsScreen = () => {
  const { user, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  // All hooks must be called unconditionally at the top level
  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-reviews", user?.email],
    queryFn: () => fetchAllUserReviews(user?.email, axiosSecure),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: !!user?.email,
    retry: 1,
  });

  // useEffect to handle initial data loading
  useEffect(() => {
    // Only refetch if we have a user email
    if (user?.email) {
      refetch();
    }
  }, [user?.email, refetch]);

  const handleDeleteReview = useCallback(
    (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        focusCancel: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await deleteReview(id);
            successToast(res.message || "Review deleted successfully");
            refetch();
          } catch (error) {
            const errorMessage =
              error?.response?.data?.message ||
              error.message ||
              "Failed to delete review";
            errorToast(errorMessage);
          }
        }
      });
    },
    [successToast, errorToast, refetch]
  );

  const handleUpdateReview = useCallback(
    async (id, updatedData) => {
      try {
        const res = await updateReview(id, updatedData);
        refetch();
        return res;
      } catch (error) {
        throw error;
      }
    },
    [refetch]
  );

  // Render loading state if necessary
  if (isLoading) {
    return <Loading />;
  }

  // Render error state if necessary
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

  // Render empty state if necessary
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No Reviews Found"
        message="You haven't posted any reviews yet."
        actionLabel="Browse Scholarships"
        actionLink="/scholarships"
      />
    );
  }

  // Render data
  return (
    <section className="overflow-x-auto grow p-4">
      <h2 className="text-2xl font-montserrat font-bold mb-6">Your Reviews</h2>
      <div className="overflow-x-auto rounded-lg border border-base-300">
        <table className="table w-full">
          <thead className="font-montserrat bg-base-200">
            <tr>
              <th className="w-1/5">University</th>
              <th className="w-2/5">Review</th>
              <th className="w-1/10">Rating</th>
              <th className="w-1/5">Date</th>
              <th className="w-1/5">Actions</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((item) => (
              <ReviewRow
                key={item.review.applicationId}
                review={item.review}
                onDelete={handleDeleteReview}
                onUpdate={handleUpdateReview}
                successToast={successToast}
                errorToast={errorToast}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserReviewsScreen;
