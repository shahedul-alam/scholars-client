import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; 
import { Rating } from "react-simple-star-rating";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import { cancelApplication, postReview } from "../../utilities/utilities";

// API request with proper error handling
const fetchAllApplications = async (email) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/applications?email=${email}`
    );
    return response.data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to fetch applications. Please try again later.");
  }
};

const ApplicationRows = ({
  app,
  handleCancelApplication,
  handleEditApplication,
  handlePostReview,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const { scholarshipInfo } = app;
  const modalId = `modal-${app._id}`;

  // Check if the user has already reviewed this application
  useEffect(() => {
    const found = scholarshipInfo?.reviews?.some(
      (reviewItem) =>
        app?.email?.toLowerCase().trim() ===
          reviewItem?.email?.toLowerCase().trim() &&
        app?._id === reviewItem?.applicationId
    );
    setAlreadyReviewed(found);
  }, [scholarshipInfo, app?.email, app?._id]);

  const handleReview = (e) => {
    e.preventDefault();

    if (!rating || !review.trim()) {
      return;
    }

    handlePostReview(rating, review, app);
    document.getElementById(modalId).close();
    setRating(0);
    setReview("");
    setAlreadyReviewed(true);
  };

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  return (
    <tr>
      <td>
        <div>
          <div className="font-bold">{scholarshipInfo.universityName}</div>
          <div className="text-sm opacity-50">
            {scholarshipInfo.universityLocationAddress}
          </div>
        </div>
      </td>
      <td>{app.feedback || "No feedback yet"}</td>
      <td>{scholarshipInfo.subjectName}</td>
      <td>{app.degree}</td>
      <td>${scholarshipInfo.applicationFees}</td>
      <td>${scholarshipInfo.serviceCharge}</td>
      <td>
        <span
          className={`badge ${
            app.status === "approved"
              ? "badge-success"
              : app.status === "pending"
              ? "badge-warning"
              : "badge-error"
          }`}
        >
          {app.status}
        </span>
      </td>
      <td>
        <div className="space-y-2">
          <Link
            to={`/scholarships/${app.scholarshipId}`}
            className="btn btn-info text-white w-full"
            aria-label={`View details for ${scholarshipInfo.universityName}`}
          >
            Details
          </Link>
          <button
            onClick={() => handleEditApplication(app.status, app._id)}
            className="btn btn-primary text-white w-full"
            disabled={app.status !== "pending"}
            aria-label={`Edit application for ${scholarshipInfo.universityName}`}
          >
            Edit
          </button>
          <button
            className="btn btn-warning text-white w-full"
            onClick={() => handleCancelApplication(app._id)}
            aria-label={`Cancel application for ${scholarshipInfo.universityName}`}
          >
            Cancel
          </button>
        </div>
      </td>
      <td>
        <button
          className="btn btn-success text-white w-full"
          onClick={() => document.getElementById(modalId).showModal()}
          disabled={alreadyReviewed}
          aria-label={`${
            alreadyReviewed ? "Review already submitted" : "Leave a review"
          }`}
        >
          {alreadyReviewed ? "Submitted" : "Review"}
        </button>

        <dialog id={modalId} className="modal">
          <div className="modal-box">
            <h3 className="font-bold font-montserrat text-lg">
              Leave a Review for {scholarshipInfo.universityName}
            </h3>
            <div className="mt-4 space-y-1">
              <p className="font-hind">Rate Your Experience</p>
              <div>
                <Rating
                  SVGclassName="inline"
                  size={24}
                  onClick={(value) => setRating(value)}
                  initialValue={rating}
                  allowHover={true}
                  aria-label="Rating"
                />
              </div>
            </div>
            <div>
              <form method="dialog" className="w-full" onSubmit={handleReview}>
                <div className="mt-4 space-y-1 mb-4">
                  <p className="font-hind">Review Your Experience</p>
                  <div>
                    <textarea
                      className="textarea textarea-bordered w-full placeholder:font-hind"
                      placeholder="Write your review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      aria-label="Review comments"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={closeModal}
                    aria-label="Close review dialog"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn bg-orange text-white"
                    disabled={!rating || !review.trim()}
                    aria-label="Submit review"
                  >
                    Post review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </td>
    </tr>
  );
};

const UserApplicationScreen = () => {
  const { user, successToast, errorToast } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["applications", user?.email],
    queryFn: () => fetchAllApplications(user?.email),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: !!user?.email, // Only run query if we have user email
  });

  const handleCancelApplication = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cancelApplication(id);
          successToast(res.message);
          refetch();

          Swal.fire({
            title: "Canceled!",
            text: "Your application has been canceled.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to cancel application";
          errorToast(errorMessage);
        }
      }
    });
  };

  const handleEditApplication = (status, id) => {
    if (status === "pending") {
      navigate(`/applications/${id}/update`);
    } else {
      errorToast("Cannot edit. The application is processing."); // Fixed typo
    }
  };

  const handlePostReview = async (rating, review, app) => {
    const reviewDetails = {
      ratingPoint: rating,
      reviewerComments: review,
      reviewDate: new Date().toISOString(),
      scholarshipId: app.scholarshipId,
      universityName: app.scholarshipInfo.universityName,
      applicationId: app._id,
      reviewerName: app.name,
      email: app.email,
      reviewerImage: app.photoURL,
      userId: app.userId,
      paymentId: app.paymentId,
    };

    try {
      const res = await postReview(reviewDetails);
      successToast(res.message);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to post review";
      errorToast(errorMessage);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!data?.length) {
    return (
      <div className="grow flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-montserrat font-bold mb-4">
          No Applications Found
        </h2>
        <p className="font-hind mb-6">
          You haven't applied to any scholarships yet.
        </p>
        <Link to="/all-scholarship" className="btn btn-primary">
          Browse Scholarships
        </Link>
      </div>
    );
  }

  return (
    <section className="overflow-x-auto grow px-4 md:px-0">
      <h2 className="text-2xl font-montserrat font-bold mb-6">
        Your Applications
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="font-montserrat">
            <tr>
              <th>University Name</th>
              <th>Application Feedback</th>
              <th>Subject Category</th>
              <th>Applied Degree</th>
              <th>Application Fees</th>
              <th>Service Charge</th>
              <th>Application Status</th>
              <th>Action</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((app) => (
              <ApplicationRows
                key={app._id}
                app={app}
                handleCancelApplication={handleCancelApplication}
                handleEditApplication={handleEditApplication}
                handlePostReview={handlePostReview}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserApplicationScreen;
