import Slider from "../components/homepage/Slider";
import HowScholarsWorks from "../components/homepage/HowScholarsWorks";
import Frequently from "../components/homepage/Frequently";
import FeaturedScholarship from "../components/homepage/FeaturedScholarship";

const Homepage = () => {
  return (
    <main>
      <Slider />
      <FeaturedScholarship />
      <HowScholarsWorks />
      <Frequently />
    </main>
  );
};

export default Homepage;
