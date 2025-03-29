import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Homepage from "../pages/Homepage";
import { scholarshipLoader } from "../components/homepage/FeaturedScholarship";
import ScholarshipDetailsPage, { scholarshipDetailsLoader } from "../pages/ScholarshipDetailsPage";
import ErrorPage from "../pages/ErrorPage";
import AllScholarshipPage from "../pages/AllScholarshipPage";

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
        path: "/scholarships/:id",
        element: <ScholarshipDetailsPage />,
        loader: scholarshipDetailsLoader,
        errorElement: <ErrorPage />,
      },
      {
        path: "/all-scholarship",
        element: <AllScholarshipPage />,
      }
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
