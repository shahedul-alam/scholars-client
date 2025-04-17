import { Link, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const [dashboardRoute, setDashboardRoute] = useState("user-dashboard");
  const { user, dbUser, signoutUser, successToast, errorToast } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signoutUser()
      .then(() => {
        successToast("Signout successfully.");
        navigate("/login");
      })
      .catch(() => {
        errorToast("Uh-oh! We couldn't sign you out.");
      });
  };

  if (dbUser) {
    if (dbUser.role === "admin") {
      setDashboardRoute("admin-dashboard");
    } else if (dbUser.role === "moderator") {
      setDashboardRoute("moderator-dashboard");
    }
  }

  return (
    <header>
      <nav className="container mx-auto font-hind">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm rounded-box dropdown-content bg-base-100  z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>
                  <Link to={"all-scholarship"}>All Scholarship</Link>
                </li>
                <li>
                  <Link to={dashboardRoute}>Dashboard</Link>
                </li>
              </ul>
            </div>
            <Link to={"/"} className="btn btn-ghost text-xl">
              Scholars
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"all-scholarship"}>All Scholarship</Link>
              </li>
              <li>
                <Link to={dashboardRoute}>Dashboard</Link>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            {user ? (
              <div className="space-x-2">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt={`${user.displayName} photo`}
                      src={user.photoURL}
                    />
                  </div>
                </div>
                <button
                  className="btn bg-orange text-white"
                  onClick={handleSignout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to={"login"} className="btn bg-orange text-white">
                  Login
                </Link>
                <Link to={"register"} className="btn bg-blue text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
