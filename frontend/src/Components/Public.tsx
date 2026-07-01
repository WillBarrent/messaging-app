import { Navigate, Outlet, useLocation, useOutlet } from "react-router";
import NotFound from "../Pages/NotFound";
import { useContext } from "react";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";

const PublicRoutes = () => {
  const { isLoggedIn } = useContext(UserContext) as UserContextType;
  const location = useLocation();
  const outlet = useOutlet();

  if (!outlet) {
    return <NotFound />;
  }

  return !isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/chats" replace state={{ from: location }} />
  );
};

export default PublicRoutes;
