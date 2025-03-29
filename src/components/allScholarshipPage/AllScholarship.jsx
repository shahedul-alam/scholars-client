import { useQuery } from "@tanstack/react-query";
import { FeaturedScholarshipCards } from "../homepage/FeaturedScholarship";
import axios from "axios";
import Loading from "../../shared/Loading";
import { useState } from "react";
import NoData from "../../shared/NoData";

const AllScholarship = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["scholarships", query],
    queryFn: () => fetchAllScholarship(query),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="container mx-auto my-12 md:my-16 px-4">
      <h1 className="text-4xl font-bold font-montserrat text-center mb-8">
        All Scholarships
      </h1>
      <div className="flex gap-2 mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search Scholarships..."
          className="input input-bordered w-full placeholder:font-hind"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn bg-orange text-white font-hind" onClick={() => setQuery(search)}>Search</button>
      </div>

      {isLoading ? (
        <Loading />
      ) : data.length !== 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 mb-8">
          {data?.map((item) => (
            <FeaturedScholarshipCards key={item._id} data={item} />
          ))}
        </div>
      ) : <NoData /> }
    </section>
  );
};

export default AllScholarship;

const fetchAllScholarship = async (query) => {
  const response = await axios.get("http://localhost:5000/scholarships", {
    params: { query: query || undefined },
  });

  return response.data;
};
