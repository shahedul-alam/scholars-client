import ScholarshipDetailsBar from "./ScholarshipDetailsBar";
import ScholarshipInfoBar from "./ScholarshipInfoBar";

const ScholarshipDetails = ({ data }) => {
  return (
    <section className="container mx-auto px-4 flex flex-col gap-5 md:flex-row-reverse md:gap-8 md:px-0 mb-12 md:mb-16">
      <ScholarshipInfoBar data={data} />
      <ScholarshipDetailsBar data={data} />
    </section>
  );
};

export default ScholarshipDetails;
