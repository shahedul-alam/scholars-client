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
import PaymentPage from "../pages/PaymentPage";
import ApplicationPage, {
  scholarshipAndUserLoader,
} from "../pages/ApplicationPage";
import UserApplicationScreen from "../components/dashboard/UserApplicationScreen";
import UpdateApplicationPage, {
  applicationLoader,
} from "../pages/UpdateApplicationPage";
import UserReviewsScreen from "../components/dashboard/UserReviewsScreen";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileScreen from "../components/dashboard/ProfileScreen";
import ModeratorRoute from "./ModeratorRoute";
import ModeratorMangeScholarships from "../components/dashboard/ModeratorMangeScholarships";
import ModeratorAllReviews from "../components/dashboard/ModeratorAllReviews";
import ModeratorAllAppliedScholarships from "../components/dashboard/ModeratorAllAppliedScholarships";
import ModeratorAddScholarship from "../components/dashboard/ModeratorAddScholarship";

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
        path: "/applications/:id/apply",
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
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // common routes
          {
            index: true,
            element: <Navigate to="profile" replace />,
          },
          // user routes
          {
            path: "profile",
            element: <ProfileScreen />,
          },
          {
            path: "applications",
            element: <UserApplicationScreen />,
          },
          {
            path: "reviews",
            element: <UserReviewsScreen />,
          },
          // moderator routes
          {
            path: "manage-scholarships",
            element: (
              <ModeratorRoute>
                <ModeratorMangeScholarships />
              </ModeratorRoute>
            ),
          },
          {
            path: "all-reviews",
            element: (
              <ModeratorRoute>
                <ModeratorAllReviews />
              </ModeratorRoute>
            ),
          },
          {
            path: "all-applied-scholarship",
            element: (
              <ModeratorRoute>
                <ModeratorAllAppliedScholarships />
              </ModeratorRoute>
            ),
          },
          {
            path: "add-scholarship",
            element: (
              <ModeratorRoute>
                <ModeratorAddScholarship />
              </ModeratorRoute>
            ),
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
