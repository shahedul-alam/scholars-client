import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import { Link } from "react-router";
import { cancelApplication } from "../../utilities/utilities";
import Swal from "sweetalert2";

const UserApplicationScreen = () => {
  const { user, successToast, errorToast } = useAuth();

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
      confirmButtonText: "Yes, cancel it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cancelApplication(id);
          successToast(res.message);
          refetch();
    
          Swal.fire({
            title: "Canceled!",
            text: "Your application has been canceled.",
            icon: "success"
          });
        } catch (error) {
          errorToast(error.response.message);
        }
      }
    });
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
            <ApplicationRows key={app._id} app={app} handleCancelApplication={handleCancelApplication} />
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserApplicationScreen;

const ApplicationRows = ({ app, handleCancelApplication }) => {
  const { scholarshipInfo } = app;
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
          <Link to={`/scholarships/${app.scholarshipId}`} className="btn btn-info text-white w-full">Details</Link>
          <button className="btn btn-primary text-white w-full">Edit</button>
          <button className="btn btn-warning text-white w-full" onClick={() => handleCancelApplication(app._id)}>Cancel</button>
        </div>
      </td>
      <td>
        <button className="btn btn-success text-white w-full">Review</button>
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
