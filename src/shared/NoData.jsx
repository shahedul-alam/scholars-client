import Lottie from "lottie-react";
import noDataAnimation from "../assets/animations/noDataLottie.json";


const NoData = () => {
  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="max-w-xl p-5 mx-auto">
        <div className="size-1/2 mx-auto mb-6">
          <Lottie animationData={noDataAnimation} />
        </div>
      </div>
    </section>
  );
};

export default NoData;