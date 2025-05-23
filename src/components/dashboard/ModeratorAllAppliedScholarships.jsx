import Swal from "sweetalert2";
import EmptyState from "../../shared/EmptyState";
import ErrorState from "../../shared/ErrorState";
import Loading from "../../shared/Loading";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ApplicationDetailsModal from "./ApplicationDetailsModal";
import ApplicationFeedbackModal from "./ApplicationFeedbackModal";

const fetchAllApplications = async (email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await axiosSecure.get(
      `/all-applications-moderator?email=${email}`
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

const cancelApplication = async (applicationId, email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  if (!applicationId) throw new Error("Application ID is required");

  try {
    const response = await axiosSecure.patch(
      `/reject-application-moderator/${applicationId}?email=${email}`,
      { status: "Rejected" }
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

const ApplicationRows = ({ application, refetch, handleCancelApplication }) => {
  const {
    _id,
    country,
    degree,
    ssc,
    hsc,
    photoURL,
    name,
    status,
    scholarshipInfo,
    feedback,
  } = application;

  const { universityName, universityImageLogo, universityLocationAddress } =
    scholarshipInfo;

  const detailsModalId = `detailsModal-${_id}`;
  const feedbackModalId = `feedbackModal-${_id}`;

  const showDetailsModal = () => {
    document.getElementById(detailsModalId).showModal();
  };
  const showFeedbackModal = () => {
    document.getElementById(feedbackModalId).showModal();
  };

  return (
    <tr className="hover:bg-base-200">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={universityImageLogo} alt={`${universityName} photo`} />
            </div>
          </div>
          <div>
            <div className="font-bold">{universityName}</div>
            <div className="text-sm opacity-50">
              {universityLocationAddress}
            </div>
          </div>
        </div>
      </td>
      <td>{feedback || "No feedback yet"}</td>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={photoURL} alt={`${name} photo`} />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-sm opacity-50">{country}</div>
          </div>
        </div>
      </td>
      <td>{degree}</td>
      <td>{`${ssc} / 5`}</td>
      <td>{`${hsc} / 5`}</td>
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs text-white font-semibold ${
            status === "pending"
              ? "bg-warning"
              : status === "approved"
              ? "bg-success"
              : "bg-error"
          }`}
        >
          {status}
        </span>
      </td>
      <td>
        <div className="space-y-2">
          <button
            className="btn btn-primary text-white w-full"
            onClick={showDetailsModal}
          >
            Details
          </button>
          <ApplicationDetailsModal
            detailsModalId={detailsModalId}
            application={application}
          />
          <button
            className="btn btn-info text-white w-full"
            onClick={showFeedbackModal}
          >
            Feedback
          </button>
          <ApplicationFeedbackModal
            feedbackModalId={feedbackModalId}
            application={application}
            refetch={refetch}
          />
          <button
            className="btn btn-error text-white w-full"
            onClick={() => handleCancelApplication(_id)}
            disabled={status === "Rejected"}
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
};

const ModeratorAllAppliedScholarships = () => {
  const { user, loading, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["applications", user?.email],
    queryFn: () => fetchAllApplications(user?.email, axiosSecure),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: !loading,
    retry: 1,
  });

  const handleCancelApplication = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cancelApplication(id, user?.email, axiosSecure);

          refetch();
          Swal.fire({
            title: "Rejected!",
            text: "Application has been rejected.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to reject application";
          errorToast(errorMessage);
        }
      }
    });
  };

  if (isLoading || loading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Applications"
        message={error.message}
        actionLabel="Try again"
        action={refetch}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No Applications Found"
        message="Nobody haven't applied for any scholarships yet."
        actionLabel="Browse Scholarships"
        actionLink="/all-scholarship"
      />
    );
  }

  return (
    <section className="overflow-x-auto grow p-4">
      <h2 className="text-2xl font-montserrat font-bold mb-6">
        All Applications ({data.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="font-montserrat">
            <tr>
              <th>University</th>
              <th>Feedback</th>
              <th>Applicant</th>
              <th>Degree</th>
              <th>SSC GPA</th>
              <th>HSC GPA</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((application) => (
              <ApplicationRows
                key={application._id}
                application={application}
                refetch={refetch}
                handleCancelApplication={handleCancelApplication}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ModeratorAllAppliedScholarships;
