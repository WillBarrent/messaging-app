import React, { useContext, useState } from "react";
import UserContext from "../UserContext";
import type { Chat, UserContextType } from "../types";
import styled from "styled-components";
import { RiSendPlaneFill } from "react-icons/ri";
import { format } from "date-fns";
import PfP from "../assets/pfp.jpeg";

const Wrapper = styled.div`
  flex: 1;
  border: 5px solid black;
  margin: 20px;

  display: flex;
  flex-direction: column;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;

  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  justify-content: flex-start;

  padding: 20px;
`;

const MessageForm = styled.form`
  width: 100%;
  padding: 10px 20px;
  margin-bottom: 0;

  display: flex;
`;

const MessageInput = styled.input`
  flex: 1;
  outline: none;
  border: 3px solid black;
  border-right: 0px;
  padding: 5px;
  font-family: inherit;
  font-size: 15px;
`;

const MessageSubmitButton = styled.button`
  display: flex;
  padding: 5px;
  outline: none;
  border: none;
  border-radius: 50%;
  background-color: #000;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const MessageSentAt = styled.div`
  font-size: 10px;  
  align-self: flex-end;
`;

const MessageSubmitButtonWrapper = styled.div`
  padding: 5px;
  border: 3px solid black;
  border-left: 0px;
`;

const MessageDisplay = styled.div<{ $isSender?: boolean }>`
  border: 3px solid black;
  padding: 10px;

  width: max-content;
  max-width: 500px;

  background-color: ${(props) => (props.$isSender ? "#000" : "#fff")};
  color: ${(props) => (props.$isSender ? "#fff" : "#000")};
  align-self: ${(props) => (props.$isSender ? "flex-end" : "flex-start")};

  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Pfp = styled.img`
  width: 40px;
  border-radius: 50%;
`;

const ChatInfo = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;

  border-bottom: 5px solid black;
`;

const ChatInfoUsername = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

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

  const chatterId = chat.users[0].id;
  const chatterName = chat.users[0].username;

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
    <Wrapper>
      <ChatInfo>
        <Pfp src={PfP} alt="" />
        <ChatInfoUsername>{chatterName}</ChatInfoUsername>
      </ChatInfo>

      <Messages>
        {chat.messages.map((message) => {
          const isSender = message.senderId === user?.userId;
          const sentAt = format(new Date(message.createdAt), "PP, p");

          return (
            <MessageDisplay $isSender={isSender} key={message.id}>
              <div>{message.content}</div>
              <MessageSentAt>{sentAt}</MessageSentAt>
            </MessageDisplay>
          );
        })}
      </Messages>

      <MessageForm onSubmit={onSubmit}>
        <MessageInput
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <MessageSubmitButtonWrapper>
          <MessageSubmitButton type="submit">
            <RiSendPlaneFill size={20} color="#fff" />
          </MessageSubmitButton>
        </MessageSubmitButtonWrapper>
      </MessageForm>
    </Wrapper>
  );
};

export default ChatDisplay;
