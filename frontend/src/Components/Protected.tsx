import { Navigate, Outlet, useLocation, useOutlet } from "react-router";
import NotFound from "../Pages/NotFound";
import { useContext } from "react";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useContext(UserContext) as UserContextType;
  const location = useLocation();
  const outlet = useOutlet();

  if (!outlet) {
    return <NotFound />;
  }

  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoutes;
