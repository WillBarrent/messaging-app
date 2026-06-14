import { Link, Route, Routes, useMatch } from "react-router";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import React, { useContext, useEffect, useState } from "react";
import UserContext, { type UserContextType } from "./UserContext";
import ChatList from "./Pages/ChatList";
import ChatDisplay from "./Pages/Chat";

export interface Message {
  id: number;
  content: string;
  senderId: number | null;
  receiverId: number | null;
}

export interface User {
  id: number;
  username: string;
}

export interface Chat {
  id: number;
  messages: Message[];
  users: User[];
}

const App = () => {
  const { user, setLocalStorage, clearLocalStorage } = useContext(
    UserContext,
  ) as UserContextType;
  const [chats, setChats] = useState<Chat[]>([]);
  const users: User[] = chats.map((chat) => {
    return chat.users[0];
  });
  const params = useMatch("/chats/:id");

  const chat = chats.find((c) => c.users[0].id === Number(params?.params.id));

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

  const onLogout = (e: React.SyntheticEvent) => {
    e.preventDefault();

    clearLocalStorage();
  };

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
    <div>
      <div>
        {user ? (
          <div>
            <Link to={"/"}>Chats</Link>
            <button onClick={onLogout}>logout</button>
          </div>
        ) : null}
        {!user ? (
          <>
            <Link to={"/login"}>Login</Link>
            <Link to={"/sign-up"}>SignUp</Link>
          </>
        ) : null}
      </div>
      <Routes>
        <Route index path="/" element={<ChatList users={users} />} />
        <Route
          path="chats/:id"
          element={<ChatDisplay chat={chat} onMessageSend={onMessageSend} />}
        />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
