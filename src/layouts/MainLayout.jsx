import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <h1>scholars!</h1>
      <Outlet />
    </>
  );
};

export default MainLayout;
