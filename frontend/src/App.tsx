import { Route, Routes } from "react-router";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { useContext, useEffect } from "react";
import UserContext from "./UserContext";
import ChatList from "./Pages/ChatList";
import ChatDisplay from "./Pages/Chat";
import type { UserContextType } from "./types";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import ProtectedRoutes from "./Components/Protected";
import PublicRoutes from "./Components/Public";

const App = () => {
  const { user, setLocalStorage } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    const userInStorage = localStorage.getItem("user");
    if (userInStorage && user === null) {
      setLocalStorage(JSON.parse(userInStorage));
    }
  }, [setLocalStorage, user]);

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="chats" element={<ChatList />}>
          <Route path=":id" element={<ChatDisplay />} />
        </Route>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/" element={<PublicRoutes />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
