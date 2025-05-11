import Swal from "sweetalert2";
import EmptyState from "../../shared/EmptyState";
import ErrorState from "../../shared/ErrorState";
import Loading from "../../shared/Loading";
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

const deleteUser = async (userId, email, axiosSecure) => {
  if (!email) throw new Error("Email is required");

  if (!userId) throw new Error("User ID is required");

  try {
    const response = await axiosSecure.delete(
      `/users/${userId}?email=${email}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 404) {
        throw new Error(data.message);
      }
    }
    throw new Error("Failed to delete user. Please try again later.");
  }
};

const UserRows = ({ user, handleChangeRole, handleDeleteUser }) => {
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
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            {role}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
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
        </div>
      </td>
      <td>
        <button
          className="btn btn-error text-white"
          onClick={() => handleDeleteUser(_id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const AdminManageUsers = () => {
  const { user, loading, successToast, errorToast } = useAuth();
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
    enabled: !loading,
    retry: 1,
  });

  const handleDeleteUser = (id) => {
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
          await deleteUser(id, user?.email, axiosSecure);

          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            error.message ||
            "Failed to delete user";
          errorToast(errorMessage);
        }
      }
    });
  };

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

  if (isLoading || loading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Users"
        message={error.message}
        actionLabel="Try again"
        action={refetch}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        title="No Users Found"
        message="Nobody haven't signed up for scholars yet."
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
                handleDeleteUser={handleDeleteUser}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminManageUsers;
