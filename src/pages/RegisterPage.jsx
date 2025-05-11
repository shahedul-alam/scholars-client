import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import banner from "../assets/login-page-banner.JPG";
import useAuth from "../hooks/useAuth";
import { addUser } from "../utilities/utilities";
// import { Helmet } from "react-helmet-async";

const RegisterPage = () => {
  const {
    createNewUser,
    updateUserProfile,
    logInWithGoogle,
    successToast,
    errorToast,
  } = useAuth();
  const [notValid, setNotValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";
  const regex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;

  const handleCreateNewUser = (e) => {
    e.preventDefault();

    const form = e.target;
    const displayName = form.name.value;
    const photoURL = form.photoURL.value;
    const email = form.email.value;
    const password = form.password.value;

    // checking if password is valid
    if (regex.test(password)) {
      setNotValid(false);

      createNewUser(email, password)
        .then(() => {
          updateUserProfile({ displayName, photoURL })
            .then(async () => {
              const user = {
                displayName,
                email,
                photoURL,
              };

              await addUser(user);
              successToast("Congratulations! Registered successfully");
              navigate(from, { replace: true });
            })
            .catch(() => {
              errorToast("Uh-oh! There was an issue creating your account.");
            });
        })
        .catch(() => {
          errorToast("Uh-oh! There was an issue creating your account.");
        });
    } else {
      setNotValid(true);
    }
  };

  const handleLogInWithGoogle = () => {
    logInWithGoogle()
      .then(async (result) => {
        await addUser(result.user);
        successToast("Congratulations! Registered successfully");
        navigate(from, { replace: true });
      })
      .catch(() => {
        errorToast("Uh-oh! There was an issue creating your account.");
      });
  };

  return (
    <>
      {/* <Helmet>
        <title>Register | the hotel</title>
      </Helmet> */}
      <main
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="hero-overlay bg-opacity-50"></div>
        <div className="hero-content w-full flex-col lg:flex-row lg:justify-start">
          <div className="card bg-base-100 rounded-xl w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleCreateNewUser}>
              <h1 className="text-4xl font-montserrat text-blue font-bold text-center mb-4">
                Register
              </h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="input input-bordered border-black w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="text"
                  name="photoURL"
                  placeholder="Enter your photo URL"
                  className="input input-bordered border-black w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered border-black w-full"
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
                  className="input input-bordered border-black w-full"
                  required
                />
              </div>
              {notValid && (
                <div className="form-control">
                  <p className="label-text-alt text-red-600">
                    Password must include at least 6 characters, with both
                    uppercase and lowercase letters
                  </p>
                </div>
              )}
              <div className="form-control mt-4">
                <button className="btn bg-orange font-hind text-white w-full">
                  Register / Sign Up
                </button>
              </div>
              <label className="label">
                <p className="label-text-alt">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="label-text-alt link link-hover"
                  >
                    Login
                  </Link>
                </p>
              </label>
              <div className="form-control mt-2">
                <p className="text-sm font-hind font-medium text-center text-orange mb-2">
                  Or, register with
                </p>
                <button
                  className="btn bg-blue text-white w-full font-hind"
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

export default RegisterPage;
