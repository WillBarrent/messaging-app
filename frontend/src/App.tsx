import { Route, Routes, useMatch } from "react-router";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import ChatList from "./Pages/ChatList";
import ChatDisplay from "./Pages/Chat";
import type { Chat, User, UserContextType } from "./types";
import NotFound from "./Pages/NotFound";

const App = () => {
  const { user, setLocalStorage } = useContext(UserContext) as UserContextType;
  const [chats, setChats] = useState<Chat[]>([]);
  const users: User[] = chats.map((chat) => {
    return chat.users[0];
  });
  const params = useMatch("/chats/:id");

  const chat = chats.find((c) => c.users[0].id === Number(params?.params.id));
  const lastMessages = chats.map((chat) => {
    return chat.messages.at(0);
  });

  useEffect(() => {
    const userInStorage = localStorage.getItem("user");
    if (userInStorage && user === null) {
      setLocalStorage(JSON.parse(userInStorage));
    }
  }, [setLocalStorage, user]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/users/chats/${user?.userId}`, {
        headers: {
          Authorization: user?.token || "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setChats(data);
        });
    }
  }, [user]);

  const onMessageSend = (updatedChat: Chat) => {
    setChats(
      chats.map((chat) => {
        if (chat.id === updatedChat.id) {
          return updatedChat;
        }

        return chat;
      }),
    );
  };

  return (
    <Routes>
      <Route
        path="/chats"
        element={<ChatList users={users} lastMessages={lastMessages} />}
      >
        <Route
          path=":id"
          element={<ChatDisplay chat={chat} onMessageSend={onMessageSend} />}
        />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
