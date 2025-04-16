import { Outlet } from "react-router";
import UserDashboardSidebar from "../components/userDashboardPage/userDashboardSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const UserDashboardLayout = () => {
  const queryClient = new QueryClient();
  
  return (
    <main className="container mx-auto min-h-screen mb-12 md:mb-16">
      <div className="flex flex-col md:flex-row gap-4">
        <UserDashboardSidebar />
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </main>
  );
};

export default UserDashboardLayout;
