import { Link, useLocation, useNavigate } from "react-router";
import banner from "../assets/login-page-banner.JPG";
import useAuth from "../hooks/useAuth";
import { addUser, getUser } from "../utilities/utilities";

// import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  const {
    setDbUser,
    setDbUserInitialized,
    signinUser,
    logInWithGoogle,
    successToast,
    errorToast,
    loading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";
  console.log(from, location.state)

  const handleSignInUser = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signinUser(email, password)
      .then(async () => {
        const result = await getUser({ email });
        setDbUser(result);
        setDbUserInitialized(true);

        successToast("Welcome back! Logged in successfully.");

        navigate(from, { replace: true });
      })
      .catch((error) => {
        errorToast("Uh-oh! We couldn't log you in.");
      });
  };

  const handleLogInWithGoogle = () => {
    logInWithGoogle()
      .then(async (result) => {
        const user = result.user;
        await addUser(user);

        const userResult = await getUser(user);
        setDbUser(userResult);
        setDbUserInitialized(true);

        successToast("Welcome back! Logged in successfully.");

        navigate(from, { replace: true });
      })
      .catch(() => {
        errorToast("Uh-oh! We couldn't log you in.");
      });
  };

  return (
    <>
      {/* <Helmet>
        <title>Login | the hotel</title>
      </Helmet> */}
      <main
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="hero-overlay bg-opacity-50"></div>
        <div className="hero-content w-full flex-col lg:flex-row lg:justify-start">
          <div className="card rounded-xl bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleSignInUser}>
              <h1 className="text-4xl font-montserrat text-blue font-bold text-center mb-4">
                Login
              </h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full border-black rounded-md"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full border-black rounded-md"
                  required
                />
                <label className="label">
                  <Link
                    // to={`/reset-password`}
                    className="label-text-alt link link-hover"
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn w-full bg-orange text-white font-hind">
                  Login / Sign In
                </button>
              </div>
              <label className="label">
                <p className="label-text-alt">
                  Don't have an account?{" "}
                  <Link
                    to={"/register"}
                    className="label-text-alt link link-hover"
                  >
                    register
                  </Link>
                </p>
              </label>
              <div className="form-control mt-2">
                <p className="text-sm font-medium text-center text-orange mb-2">
                  Or, login with
                </p>
                <button
                  className="btn w-full bg-blue text-white font-hind"
                  onClick={handleLogInWithGoogle}
                >
                  Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
