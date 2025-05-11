import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";
import ScholarshipForm from "./ScholarshipForm";

const ModeratorAddScholarship = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="overflow-x-auto grow p-4">
      <h2 className="text-2xl font-montserrat font-bold mb-6">
        Add Scholarship
      </h2>
      <ScholarshipForm />
    </section>
  );
};

export default ModeratorAddScholarship;
