import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApplicationFeedbackModal = ({
  feedbackModalId,
  application,
  refetch,
}) => {
  const [feedback, setFeedback] = useState(null);
  const { user, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { email } = user;

  const closeModal = () => {
    document.getElementById(feedbackModalId).close();
  };

  const handleFeedbackOnApplication = async () => {
    if (!email) errorToast("Email is required");

    if (!feedback) errorToast("Please provide feedback before submitting.");

    try {
      const response = await axiosSecure.patch(
        `/applications-feedback-moderator/${application._id}?email=${email}`,
        { feedback }
      );

      refetch();
      closeModal();
      successToast(response.data.message);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          errorToast(data.message);
        }
      }
      errorToast("Failed to post feedback. Please try again later.");
    }
  };

  return (
    <dialog id={feedbackModalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold font-montserrat text-lg">
          Feedback on application
        </h3>
        <div className="modal-action">
          <div className="w-full">
            <div className="mb-4">
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write your feedback here"
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
            <div className="space-x-2">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
              <button
                className="btn bg-orange text-white"
                disabled={!feedback}
                onClick={handleFeedbackOnApplication}
              >
                Post Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ApplicationFeedbackModal;
