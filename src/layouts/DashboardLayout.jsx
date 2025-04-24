import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  const queryClient = new QueryClient();

  return (
    <main className="container mx-auto min-h-screen mb-12 md:mb-16">
      <div className="flex flex-col md:flex-row gap-4">
        <DashboardSidebar />
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </main>
  );
};

export default DashboardLayout;
