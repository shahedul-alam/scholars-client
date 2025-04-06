import { Link } from "react-router";

const ScholarshipDetailsBar = ({ data }) => {
  const {
    _id,
    universityName,
    universityImageLogo,
    universityLocationAddress,
    scholarshipCategory,
    applicationDeadline,
    subjectName,
    scholarshipDescription,
    stipend,
    postDate,
    serviceCharge,
    applicationFees,
    reviews,
  } = data;
  return (
    <div className="md:w-3/5">
      <div className="flex flex-col gap-4 p-6 bg-base-200 rounded-lg mb-8">
        <div className="bg-white p-5 rounded-lg">
          <img
            src={universityImageLogo}
            alt={`${universityName} Logo`}
            className="w-4/5 lg:w-2/4 object-contain"
          />
        </div>
        <div className="mt-4">
          <h2 className="font-montserrat text-3xl font-semibold mb-2">
            {universityName}
          </h2>
          <p className="font-hind text-xl font-medium text-blue">
            {universityLocationAddress}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-hind text-2xl font-semibold mb-4">Description:</h2>
        <p className="font-hind text-gray-500">{scholarshipDescription}</p>
      </div>

      <Link
        to={`/scholarships/${_id}/payment`}
        className="w-full md:btn-wide btn bg-blue text-white font-hind border-none"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default ScholarshipDetailsBar;
