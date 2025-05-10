import Swal from "sweetalert2";
import EmptyState from "../../shared/EmptyState";
import ErrorState from "../../shared/ErrorState";
import Loading from "../../shared/Loading";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const fetchAllUsers = async (email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await axiosSecure.get(`/all-users?email=${email}`);

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to fetch users. Please try again later.");
  }
};

const UserRows = ({ user, handleChangeRole }) => {
  const { _id, displayName, photoURL, email, role } = user;

  return (
    <tr className="hover:bg-base-200">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={photoURL} alt={`${displayName} photo`} />
            </div>
          </div>
          <div>
            <div className="font-bold">{displayName}</div>
          </div>
        </div>
      </td>
      <td>{email}</td>
      <td>
        <details className="dropdown">
          <summary className="btn m-1">{role}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>
              <button
                onClick={() =>
                  handleChangeRole({
                    userId: _id,
                    prevRole: role,
                    newRole: "user",
                  })
                }
              >
                User
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleChangeRole({
                    userId: _id,
                    prevRole: role,
                    newRole: "moderator",
                  })
                }
              >
                Moderator
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  handleChangeRole({
                    userId: _id,
                    prevRole: role,
                    newRole: "admin",
                  })
                }
              >
                Admin
              </button>
            </li>
          </ul>
        </details>
      </td>
      <td>
        <button
          className="btn btn-error text-white"
          // onClick={() => handleDeleteReview(applicationId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const AdminManageUsers = () => {
  const { user, dbUser, successToast, errorToast } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: () => fetchAllUsers(user?.email, axiosSecure),
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

  // const handleCancelApplication = (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, reject it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const res = await cancelApplication(id, user?.email, axiosSecure);

  //         refetch();
  //         Swal.fire({
  //           title: "Rejected!",
  //           text: "Application has been rejected.",
  //           icon: "success",
  //         });
  //       } catch (error) {
  //         const errorMessage =
  //           error?.response?.data?.message ||
  //           error.message ||
  //           "Failed to reject application";
  //         errorToast(errorMessage);
  //       }
  //     }
  //   });
  // };

  const handleChangeRole = async ({ userId, prevRole, newRole }) => {
    if (prevRole === newRole) {
      errorToast("The role remains unchanged. No updates were made.");
    }

    if (!userId) {
      errorToast("UserId is required");
    }

    try {
      const response = await axiosSecure.patch(
        `/update-user-role/${userId}?email=${user?.email}`,
        { role: newRole }
      );

      refetch();
      successToast(response.data.message);
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 404) {
          throw new Error(data.message);
        }
      }
      throw new Error("Failed to update user role. Please try again later.");
    }
  };

  if (isLoading) {
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
        All Users ({data.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="font-montserrat">
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="font-hind">
            {data.map((user) => (
              <UserRows
                key={user._id}
                user={user}
                handleChangeRole={handleChangeRole}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminManageUsers;
