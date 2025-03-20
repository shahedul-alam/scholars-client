import axios from "axios";
import { Link, useLoaderData } from "react-router";

const calAvgRating = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    console.log(i);
    sum += data[0].ratingPoint;
  }

  console.log(sum);
  return sum / data.length;
};

const FeaturedScholarshipCards = ({ data }) => {
  const {
    _id,
    universityImageLogo,
    universityName,
    scholarshipCategory,
    applicationDeadline,
    universityLocationAddress,
    subjectName,
    applicationFees,
    reviews,
  } = data;

  const avgRating =
    reviews.length === 0 ? "Not available" : calAvgRating(reviews);

  return (
    <div className="flex flex-col p-5 border border-orange rounded-xl">
      <div className="mb-2">
        <img
          src={universityImageLogo}
          alt={`${universityName} Logo`}
          className="w-3/4 border h-20 object-contain mb-4 rounded-xl border-orange"
        />
        <h2 className="text-xl font-montserrat font-semibold">
          {universityName}
        </h2>
      </div>

      <div className="grow mb-4 font-hind">
        <ul className="timeline timeline-compact timeline-vertical">
          <li>
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">
              Address: {universityLocationAddress}
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">
              Scholarship: {scholarshipCategory}
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">Deadline: {applicationDeadline}</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">Subject: {subjectName}</div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">
              Application fees: ${applicationFees}
            </div>
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end">Rating: {avgRating}</div>
          </li>
        </ul>
      </div>

      <Link
        to={`/scholarship-details/${_id}`}
        className="w-full btn bg-blue text-white border-none font-hind"
      >
        See Details
      </Link>
    </div>
  );
};

const FeaturedScholarship = () => {
  const data = useLoaderData();

  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-montserrat text-center mb-4">
          Featured Scholarships
        </h2>
        <p className="w-4/5 mx-auto text-center font-hind text-lg">
          Here are some of the best college scholarships with approaching
          deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 px-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 mb-8">
        {data.map((item) => (
          <FeaturedScholarshipCards key={item._id} data={item} />
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to={"/all-scholarships"}
          className="btn bg-orange border-none text-white"
        >
          See all scholarships
        </Link>
      </div>
    </section>
  );
};

export default FeaturedScholarship;

export const scholarshipLoader = async () => {
  const result = await axios.get("http://localhost:5000/featured-scholarships");

  return result.data;
};
