import { Link } from "react-router";

const ApplicationDetailsModal = ({ detailsModalId, application }) => {
  const {
    phone,
    gender,
    country,
    degree,
    ssc,
    hsc,
    hasStudyGap,
    photoURL,
    name,
    email,
    status,
    currentDate,
    village,
    district,
    studyGapReason,
    feedback,
    scholarshipInfo,
  } = application;

  const {
    universityName,
    universityImageLogo,
    scholarshipCategory,
    universityLocationAddress,
    applicationDeadline,
    subjectName,
    scholarshipDescription,
    stipend,
    postDate,
    serviceCharge,
    applicationFees,
  } = scholarshipInfo;

  const closeModal = () => {
    document.getElementById(detailsModalId).close();
  };

  return (
    <dialog id={detailsModalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold font-montserrat text-lg">
          Application Details
        </h3>
        <div className="modal-action">
          <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4">
              <img
                src={photoURL}
                alt={name}
                className="w-20 h-20 object-cover rounded-full border"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{name}</h2>
                <p className="text-gray-500">{email}</p>
                <p className="text-gray-500">{phone}</p>
              </div>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Gender:</strong> {gender}
              </div>
              <div>
                <strong>Degree:</strong> {degree}
              </div>
              <div>
                <strong>SSC GPA:</strong> {ssc}
              </div>
              <div>
                <strong>HSC GPA:</strong> {hsc}
              </div>
              <div>
                <strong>Study Gap:</strong> {hasStudyGap}
              </div>
              {hasStudyGap === "Yes" && (
                <div className="col-span-2">
                  <strong>Reason for Gap:</strong> {studyGapReason}
                </div>
              )}
              <div>
                <strong>District:</strong> {district}
              </div>
              <div>
                <strong>Village:</strong> {village}
              </div>
              <div>
                <strong>Country:</strong> {country}
              </div>
              <div>
                <strong>Status:</strong>{" "}
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
              </div>
              <div>
                <strong>Applied On:</strong>{" "}
                {new Date(currentDate).toLocaleDateString()}
              </div>
            </div>

            {feedback && (
              <div className="text-sm text-gray-700">
                <strong>Moderator Feedback:</strong> {feedback}
              </div>
            )}

            {/* Divider */}
            <hr className="my-4" />

            {/* Scholarship Info */}
            <div className="flex items-center gap-4">
              <img
                src={universityImageLogo}
                alt={universityName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {universityName}
                </h3>
                <p className="text-gray-600">{universityLocationAddress}</p>
              </div>
            </div>

            <div className="text-sm text-gray-700 grid grid-cols-2 gap-4">
              <div>
                <strong>Subject:</strong> {subjectName}
              </div>
              <div>
                <strong>Scholarship Type:</strong> {scholarshipCategory}
              </div>
              <div>
                <strong>Application Deadline:</strong> {applicationDeadline}
              </div>
              <div>
                <strong>Posted On:</strong>{" "}
                {new Date(postDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Stipend:</strong> {stipend || "Not applicable"}
              </div>
              <div>
                <strong>Service Charge:</strong> ${serviceCharge}
              </div>
              <div>
                <strong>Application Fee:</strong> ${applicationFees}
              </div>
            </div>

            <div className="text-sm text-gray-700 mt-2">
              <strong>Description:</strong> {scholarshipDescription}
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ApplicationDetailsModal;
