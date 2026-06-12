import React, { useContext, useState } from "react";
import type { Chat } from "../App";
import UserContext, { type UserContextType } from "../UserContext";

const ChatDisplay = ({
  chat,
  onMessageSend,
}: {
  chat: Chat | undefined;
  onMessageSend: (updatedChat: Chat) => void;
}) => {
  const { user } = useContext(UserContext) as UserContextType;
  const [message, setMessage] = useState<string>("");

  if (!chat) {
    return <div>Loading...</div>;
  }

  const chatter = chat.users[0].username;
  const chatterId = chat.users[0].id;

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newMessage = await fetch("http://localhost:3000/messages", {
      method: "POST",
      body: JSON.stringify({
        content: message,
        senderId: user?.userId,
        receiverId: chatterId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token || "",
      },
    });

    setMessage("");

    const data = await newMessage.json();
    chat.messages.push(data);
    onMessageSend(chat);
  };

  return (
    <div>
      <h1>Chat with {chatter}</h1>
      <form onSubmit={onSubmit} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {chat.messages.map((message) => {
          return (
            <div
              key={message.id}
              style={{
                border: "1px solid black",
                padding: "10px",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                Sender:{" "}
                {message.senderId === user?.userId ? user.username : chatter}
              </div>
              <div>Message: {message.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDisplay;
