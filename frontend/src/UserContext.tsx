import React, { createContext, useState } from "react";

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
