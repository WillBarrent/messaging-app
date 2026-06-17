import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { IUserContext, UserContextType } from "./types";

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserContext | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" && !user) {
      navigate("/login");
    } else if (location.pathname === "/sign-up" && !user) {
      navigate("/sign-up");
    } else if (!user) {
      navigate("/login");
    } else if (
      (location.pathname === "/login" || location.pathname === "/sign-up") &&
      user
    ) {
      navigate("/chats");
    } else {
      navigate(location.pathname);
    }
  }, [location.pathname, user, navigate]);

  const setLocalStorage = ({ token, userId, username }: IUserContext) => {
    const data = { token, userId, username };
    if (token !== undefined && userId !== undefined) {
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setLocalStorage, clearLocalStorage }}>
      {children}
    </UserContext.Provider>
  );
};
