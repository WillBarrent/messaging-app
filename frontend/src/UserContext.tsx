import React, { createContext, useState } from "react";
import type { IUserContext, UserContextType } from "./types";

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserContext | null>(null);

  const setLocalStorage = ({
    token,
    userId,
    username,
    pfpUrl,
  }: IUserContext) => {
    const data = { token, userId, username, pfpUrl };
    if (token !== undefined && userId !== undefined) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    }
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setUser(null);
  };

  const isLoggedIn = () => {
    if (localStorage.getItem("user")) {
      return true;
    }

    return false;
  };

  return (
    <UserContext.Provider value={{ user, setLocalStorage, clearLocalStorage, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
