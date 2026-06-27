import { Route, Routes } from "react-router";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { useContext, useEffect } from "react";
import UserContext from "./UserContext";
import ChatList from "./Pages/ChatList";
import ChatDisplay from "./Pages/Chat";
import type { UserContextType } from "./types";
import NotFound from "./Pages/NotFound";

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
      <Route path="/chats" element={<ChatList />}>
        <Route
          path=":id"
          element={<ChatDisplay />}
        />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
