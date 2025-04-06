import { Outlet } from "react-router";
import UserDashboardSidebar from "../components/userDashboardPage/userDashboardSidebar";

const UserDashboardLayout = () => {
  
  return (
    <main className="container mx-auto mb-12 md:mb-16">
      <div className="flex flex-col md:flex-row gap-4">
        <UserDashboardSidebar />
        <Outlet />
      </div>
    </main>
  );
};

export default UserDashboardLayout;
