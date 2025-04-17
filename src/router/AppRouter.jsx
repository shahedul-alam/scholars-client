import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Homepage from "../pages/Homepage";
import { scholarshipLoader } from "../components/homepage/FeaturedScholarship";
import ScholarshipDetailsPage, {
  scholarshipDetailsLoader,
} from "../pages/ScholarshipDetailsPage";
import ErrorPage from "../pages/ErrorPage";
import AllScholarshipPage from "../pages/AllScholarshipPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import NotFoundPage from "../pages/NotFoundPage";
import UserProfileScreen from "../components/userDashboardPage/UserProfileScreen";
import UserDashboardLayout from "../layouts/UserDashboardLayout";
import PaymentPage from "../pages/PaymentPage";
import ApplicationPage, {
  scholarshipAndUserLoader,
} from "../pages/ApplicationPage";
import UserApplicationScreen from "../components/userDashboardPage/UserApplicationScreen";
import UpdateApplicationPage, { applicationLoader } from "../pages/UpdateApplicationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
        loader: scholarshipLoader,
      },
      {
        path: "scholarships/:id",
        element: (
          <PrivateRoute>
            <ScholarshipDetailsPage />
          </PrivateRoute>
        ),
        loader: scholarshipDetailsLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "scholarships/:id/payment",
        element: (
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        ),
        loader: scholarshipDetailsLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/payments/:id/apply",
        element: (
          <PrivateRoute>
            <ApplicationPage />
          </PrivateRoute>
        ),
        loader: scholarshipAndUserLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/applications/:id/update",
        element: (
          <PrivateRoute>
            <UpdateApplicationPage />
          </PrivateRoute>
        ),
        loader: applicationLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "all-scholarship",
        element: <AllScholarshipPage />,
      },
      {
        path: "user-dashboard",
        element: (
          <PrivateRoute>
            <UserDashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          {
            path: "profile",
            element: <UserProfileScreen />,
          },
          {
            path: "application",
            element: <UserApplicationScreen />,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
