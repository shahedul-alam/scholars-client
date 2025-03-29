import { useEffect, useState } from "react";
import AllScholarship from "../components/allScholarshipPage/AllScholarship";
import Frequently from "../components/homepage/Frequently";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AllScholarshipPage = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce effect
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedQuery(searchQuery);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [searchQuery]);

  // Locally defined QueryClient
  const queryClient = new QueryClient();

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <AllScholarship
          // query={debouncedQuery}
          // setSearchQuery={setSearchQuery}
        />
      </QueryClientProvider>
      <Frequently />
    </main>
  );
};

export default AllScholarshipPage;
