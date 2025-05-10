import { FaRegUser } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineReviews } from "react-icons/md";
import { MdOutlineManageHistory } from "react-icons/md";
import { FaGoogleScholar } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";

const DashboardSidebar = () => {
  const { dbUser } = useAuth();

  if (!dbUser) {
    return <Loading />;
  }

  if (dbUser.role === "moderator") {
    return (
      <section className="self-center md:self-start font-hind px-4">
        <ul className="menu menu-horizontal md:menu-vertical bg-base-200 rounded-box md:w-56">
          <li>
            <NavLink
              to={"profile"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaRegUser className="size-4" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"manage-scholarships"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <MdOutlineManageHistory className="size-4" />
              Manage Scholarships
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"all-reviews"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <MdOutlineReviews className="size-4" />
              All Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"all-applied-scholarship"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaGoogleScholar className="size-4" />
              All Applied Scholarship
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"add-scholarship"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaWpforms className="size-4" />
              Add Scholarship
            </NavLink>
          </li>
        </ul>
      </section>
    );
  }

  if (dbUser.role === "admin") {
    return (
      <section className="self-center md:self-start font-hind px-4">
        <ul className="menu menu-horizontal md:menu-vertical bg-base-200 rounded-box md:w-56">
          <li>
            <NavLink
              to={"profile"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaRegUser className="size-4" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"manage-scholarships"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <MdOutlineManageHistory className="size-4" />
              Manage Scholarships
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"all-reviews"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <MdOutlineReviews className="size-4" />
              All Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"all-applied-scholarship"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaGoogleScholar className="size-4" />
              All Applied Scholarship
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"manage-users"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaUserEdit  className="size-4" />
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"add-scholarship"}
              className={({ isActive }) =>
                isActive
                  ? "bg-orange text-white font-semibold shadow"
                  : undefined
              }
            >
              <FaWpforms className="size-4" />
              Add Scholarship
            </NavLink>
          </li>
        </ul>
      </section>
    );
  }

  return (
    <section className="self-center md:self-start font-hind px-4">
      <ul className="menu menu-horizontal md:menu-vertical bg-base-200 rounded-box md:w-56">
        <li>
          <NavLink
            to={"profile"}
            className={({ isActive }) =>
              isActive ? "bg-orange text-white font-semibold shadow" : undefined
            }
          >
            <FaRegUser className="size-4" />
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"applications"}
            className={({ isActive }) =>
              isActive ? "bg-orange text-white font-semibold shadow" : undefined
            }
          >
            <FaWpforms className="size-4" />
            Applications
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"reviews"}
            className={({ isActive }) =>
              isActive ? "bg-orange text-white font-semibold shadow" : undefined
            }
          >
            <MdOutlineReviews className="size-4" />
            Reviews
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default DashboardSidebar;
