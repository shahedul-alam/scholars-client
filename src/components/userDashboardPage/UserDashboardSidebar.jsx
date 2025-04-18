import { FaRegUser } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineReviews } from "react-icons/md";
import { NavLink } from "react-router";

const UserDashboardSidebar = () => {
  return (
    <section className="self-center md:self-start font-hind">
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

export default UserDashboardSidebar;
