import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import type { Message, User, UserContextType } from "../types";
import styled from "styled-components";
import { RiSendPlaneFill } from "react-icons/ri";
import { format } from "date-fns";
import { useParams } from "react-router";

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

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #000;
  }
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
    background-color: rgba(0, 0, 0, 0.5);
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

const LoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  font-size: 30px;
  font-weight: 500;
`;

const ChatDisplay = () => {
  const { user } = useContext(UserContext) as UserContextType;
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [chatter, setChatter] = useState<User | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: user?.token || "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setChatter(data);
        });
    }
  }, [user, id]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/messages/${id}`, {
        headers: {
          Authorization: user?.token || "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data === null) {
            setMessages(null);
          } else {
            setMessages(data.messages);
          }
        });
    }
  }, [user, id]);

  if (messages != null && messages.length === 0) {
    return (
      <Wrapper>
        <LoadingWrapper>
          <LoadingText>Loading...</LoadingText>
        </LoadingWrapper>
      </Wrapper>
    );
  } else if (messages === null) {
    return (
      <Wrapper>
        <LoadingWrapper>
          <LoadingText>Chat was not found</LoadingText>
        </LoadingWrapper>
      </Wrapper>
    );
  }

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newMessage = await fetch("http://localhost:3000/messages", {
      method: "POST",
      body: JSON.stringify({
        content: message,
        senderId: user?.userId,
        receiverId: chatter?.id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token || "",
      },
    });

    setMessage("");

    const data = await newMessage.json();
    setMessages([data, ...messages]);
  };

  return (
    <Wrapper>
      <ChatInfo>
        <Pfp src={chatter?.profilePictureUrl} alt="" />
        <ChatInfoUsername>{chatter?.username}</ChatInfoUsername>
      </ChatInfo>

      <Messages>
        {messages.map((message) => {
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
