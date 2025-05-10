import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../hooks/useAxiosSecure";
import { getUser } from "../utilities/utilities";
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
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [dbUserInitialized, setDbUserInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && !dbUserInitialized) {
        const result = await getUser(currentUser);
        setDbUser(result);

        axiosInstance
          .post("/get-token", { email: currentUser.email })
          .then((res) => setLoading(false));
      } else {
        setDbUser(null);

        axiosInstance
          .post("/remove-token", {})
          .then((res) => setLoading(false));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createNewUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signinUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (userInfo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, { ...userInfo });
  };

  const resetUserPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logInWithGoogle = () => {
    setLoading(true);
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
    dbUser,
    setDbUser,
    setDbUserInitialized,
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
