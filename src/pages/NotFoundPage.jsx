import { useNavigate } from "react-router";
import errorAnimation from "../assets/animations/errorLottie.json";
import Lottie from "lottie-react";
// import { Helmet } from "react-helmet-async";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Helmet>
        <title>Not found | Scholars</title>
      </Helmet> */}
      <main className="w-full h-screen flex justify-center items-center">
        <div className="max-w-xl px-5">
          <div className="size-1/2 mx-auto mb-6">
            <Lottie animationData={errorAnimation} />
          </div>
          <h1 className="font-montserrat text-2xl md:text-4xl font-bold text-red-600 text-center mb-4">
            404 | Page not found
          </h1>
          <button
            className="block mx-auto btn btn-wide bg-orange text-white"
            onClick={() => navigate("/")}
          >
            Go to homepage
          </button>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
