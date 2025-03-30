import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../hooks/useAxiosSecure";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);

      // if (currentUser) {
      //   axiosInstance
      //     .post("/get-token", { email: currentUser.email })
      //     .then((res) => setLoading(false));
      // } else {
      //   axiosInstance
      //     .post("/remove-token", {})
      //     .then((res) => setLoading(false));
      // }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createNewUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signoutUser = () => {
    return signOut(auth);
  };

  const updateUserProfile = (userInfo) => {
    return updateProfile(auth.currentUser, { ...userInfo });
  };

  const resetUserPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider);
  };

  // notification alerts
  const successToast = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  const errorToast = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });

  const authInfo = {
    user,
    loading,
    createNewUser,
    signinUser,
    signoutUser,
    updateUserProfile,
    resetUserPassword,
    logInWithGoogle,
    successToast,
    errorToast,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
