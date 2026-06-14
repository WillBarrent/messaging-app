import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export interface UserContext {
  token: string | undefined;
  userId: number | undefined;
  username: string | undefined;
}

export interface UserContextType {
  user: UserContext | null;
  setLocalStorage: ({ token, userId, username }: UserContext) => void;
  clearLocalStorage: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserContext | null>(null);
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
      navigate("/");
    } else {
      navigate(location.pathname);
    }
  }, [location.pathname, user, navigate]);

  const setLocalStorage = ({ token, userId, username }: UserContext) => {
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
