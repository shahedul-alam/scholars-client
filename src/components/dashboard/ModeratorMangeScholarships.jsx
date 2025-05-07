import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect } from "react";
import { Link } from "react-router";
import Loading from "../../shared/Loading";
import ErrorState from "../../shared/ErrorState";
import EmptyState from "../../shared/EmptyState";
import Swal from "sweetalert2";
import ScholarshipUpdateModal from "./ScholarshipUpdateModal";

const fetchAllScholarships = async (email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await axiosSecure.get(
      `/all-scholarships-moderator?email=${email}`
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

const deleteScholarship = async (id, email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  if (!id) throw new Error("Scholarship ID is required");

  try {
    const response = await axiosSecure.delete(
      `/scholarships-moderator/${id}?email=${email}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to delete scholarship. Please try again later.");
  }
};

const ScholarshipRows = ({ scholarship, handleDeleteScholarship }) => {
  const {
    _id,
    universityName,
    universityLocationAddress,
    scholarshipCategory,
    subjectName,
    applicationFees,
    serviceCharge,
  } = scholarship;
  const modalId = `modal-${_id}`;

  return (
    <tr className="hover:bg-base-200">
      <td>
        <div>
          <div className="font-bold">{universityName}</div>
          <div className="text-sm opacity-50">{universityLocationAddress}</div>
        </div>
      </td>
      <td>{subjectName}</td>
      <td>{scholarshipCategory}</td>
      <td>${applicationFees}</td>
      <td>${serviceCharge}</td>
      <td>
        <div className="space-y-2">
          <Link
            to={`/scholarships/${_id}`}
            className="btn btn-info text-white w-full"
            aria-label={`View details of ${universityName} scholarship`}
          >
            Details
          </Link>
          <button
            className="btn btn-primary text-white w-full"
            aria-label={`Edit scholarship of ${universityName}`}
            onClick={() => document.getElementById(modalId).showModal()}
          >
            Edit
          </button>

          {/* scholarship update modal */}
          <ScholarshipUpdateModal modalId={modalId} scholarship={scholarship} />

          <button
            className="btn btn-warning text-white w-full"
            aria-label={`Delete scholarship of ${universityName}`}
            onClick={() => handleDeleteScholarship(_id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const ModeratorMangeScholarships = () => {
  const { user, dbUser, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["scholarships", user?.email],
    queryFn: () => fetchAllScholarships(user?.email, axiosSecure),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    enabled: !!dbUser?.role,
    retry: 1,
  });

  useEffect(() => {
    // Only refetch if we have a user email
    if (dbUser?.role === "moderator") {
      refetch();
    }
  }, [dbUser?.role, refetch]);

  const handleDeleteScholarship = (id) => {
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
          const res = await deleteScholarship(id, user?.email, axiosSecure);
          successToast(res.message);
          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "scholarship has been deleted.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to delete scholarship";
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
        title="Error Loading Scholarships"
        message={error.message}
        actionLabel="Try again"
        action={refetch}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No Scholarships Found"
        message="You haven't uploaded any scholarships yet."
        actionLabel="Browse Scholarships"
        actionLink="/all-scholarship"
      />
    );
  }

  return (
    <section className="overflow-x-auto grow p-4">
      <h2 className="text-2xl font-montserrat font-bold mb-6">
        All Scholarships ({data.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="font-montserrat">
            <tr>
              <th>University Name</th>
              <th>Subject Category</th>
              <th>Scholarship Category</th>
              <th>Application Fees</th>
              <th>Service Charge</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((scholarship) => (
              <ScholarshipRows
                key={scholarship._id}
                scholarship={scholarship}
                handleDeleteScholarship={handleDeleteScholarship}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ModeratorMangeScholarships;
