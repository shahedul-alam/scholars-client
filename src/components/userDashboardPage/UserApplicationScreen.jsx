import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import { Link, useNavigate } from "react-router";
import { cancelApplication, postReview } from "../../utilities/utilities";
import Swal from "sweetalert2";
import { Rating } from "react-simple-star-rating";
import { useEffect, useState } from "react";

const UserApplicationScreen = () => {
  const { user, successToast, errorToast } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["applications", user.email],
    queryFn: () => fetchAllApplication(user.email),
    staleTime: 30000,
    refetchOnWindowFocus: false,
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
          errorToast(error.response.data.message);
        }
      }
    });
  };

  const handleEditApplication = (status, id) => {
    if (status === "pending") {
      navigate(`/applications/${id}/update`);
    } else {
      errorToast("Can not edit. The application is precessing.");
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
      errorToast(error.message);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="overflow-x-auto grow px-4 md:px-0">
      <table className="table">
        {/* head */}
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
          {data?.map((app) => (
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
    </section>
  );
};

export default UserApplicationScreen;

const ApplicationRows = ({
  app,
  handleCancelApplication,
  handleEditApplication,
  handlePostReview,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const { scholarshipInfo } = app;

  useEffect(() => {
    const found = scholarshipInfo?.reviews?.some(
      (review) =>
        app?.email?.toLowerCase().trim() ===
          review?.email?.toLowerCase().trim() &&
        app?._id === review?.applicationId
    );
    setAlreadyReviewed(found);
  }, [scholarshipInfo, app?.email, app?._id]);

  const handleReview = (e) => {
    e.preventDefault();
    const form = e.target;

    handlePostReview(rating, review, app);

    document.getElementById(app._id).close();
    form.reset();
    setRating(0);
    setReview(null);
    setAlreadyReviewed(true);
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
      <td>{app.feedback}</td>
      <td>{scholarshipInfo.subjectName}</td>
      <td>{app.degree}</td>
      <td>${scholarshipInfo.applicationFees}</td>
      <td>${scholarshipInfo.serviceCharge}</td>
      <td>{app.status}</td>
      <td>
        <div className="space-y-2">
          <Link
            to={`/scholarships/${app.scholarshipId}`}
            className="btn btn-info text-white w-full"
          >
            Details
          </Link>
          <button
            onClick={() => handleEditApplication(app.status, app._id)}
            className="btn btn-primary text-white w-full"
          >
            Edit
          </button>
          <button
            className="btn btn-warning text-white w-full"
            onClick={() => handleCancelApplication(app._id)}
          >
            Cancel
          </button>
        </div>
      </td>
      <td>
        <button
          className="btn btn-success text-white w-full"
          onClick={() => document.getElementById(app._id).showModal()}
          disabled={alreadyReviewed}
        >
          {alreadyReviewed ? "Submitted" : "Review"}
        </button>

        <dialog id={app._id} className="modal">
          <div className="modal-box">
            <h3 className="font-bold font-montserrat text-lg">
              Leave a Review
            </h3>
            <div className="mt-4 space-y-1">
              <p className="font-hind">Rate Your Experience</p>
              <div>
                <Rating
                  SVGclassName="inline"
                  size={24}
                  onClick={(value) => setRating(value)}
                  initialValue={rating}
                  allowHover={false}
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
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => document.getElementById(app._id).close()}
                  >
                    Close
                  </button>
                  <button
                    className="btn bg-orange text-white"
                    disabled={!rating || !review}
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

const fetchAllApplication = async (query) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/applications?email=${query}`
    );

    return response.data.data;
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
