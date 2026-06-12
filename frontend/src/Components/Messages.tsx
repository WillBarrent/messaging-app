import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import UserContext, { type UserContextType } from "../UserContext";

interface Message {
  id: number;
  content: string;
  senderId: number | null;
  receiverId: number | null;
}

const Messages = () => {
  const { user } = useContext(UserContext) as UserContextType;
  const { username, id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (user !== null) {
      fetch(`http://localhost:3000/users/chats/${user?.userId}`, {
        headers: {
          Authorization: user.token || "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [id, user]);

  const onMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newMessage = JSON.stringify({
      content: message,
      receiverId: Number(id),
      senderId: user?.userId,
    });
    const request = await fetch(`http://localhost:3000/messages`, {
      method: "POST",
      body: newMessage,
      headers: {
        Authorization: user?.token || "",
        "Content-Type": "application/json",
      },
    });
    const data = await request.json();
    setMessages(messages.concat(data));
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Chat: {username}</h1>
      <form onSubmit={onMessage}>
        <label>
          message
          <input
            type="text"
            placeholder="Hi! How are you doing?"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </label>
        <button type="submit">Send</button>
      </form>
      <h2>Messages</h2>
      <div>
        {messages.map((message) => {
          return (
            <div key={message.id}>
              <div>
                Sender:
                {message.senderId === Number(id) ? username : user?.username}
              </div>
              <div>Message: {message.content}</div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
