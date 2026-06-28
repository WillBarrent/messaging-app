import { Link, Outlet } from "react-router";
import type { Chat, User, UserContextType } from "../types";
import styled from "styled-components";

import PfP from "../assets/pfp.jpeg";
import { TbLogout } from "react-icons/tb";
import { format } from "date-fns";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";

const Wrapper = styled.div`
  height: 100vh;
`;

const Layout = styled.div`
  height: 100%;
  display: flex;
`;

const Chats = styled.div`
  width: 400px;

  border: 5px solid black;
  margin: 20px;

  display: flex;
  flex-direction: column;
`;

const Pfp = styled.img`
  width: 40px;
  border-radius: 50%;
`;

const Header = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 20px;

  border-bottom: 5px solid;
`;

const Search = styled.div`
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;

  padding: 10px 5px;
  font-family: inherit;
  font-size: 15px;

  border: 3px solid black;
  outline: none;
`;

const List = styled.div`
  overflow-y: auto;
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 20px;
`;

const ChatLink = styled(Link)`
  text-decoration: none;
  color: #000;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const Chat = styled.div`
  border: 3px solid black;
  padding: 5px 10px;

  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatInfo = styled.div`
  flex: 1;
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LastMessage = styled.div`
  font-size: 15px;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Username = styled.div`
  font-weight: bold;
`;

const LastMessageTime = styled.div`
  font-size: 12.5px;
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 5px solid black;
`;

const Logout = styled.div`
  width: max-content;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.5);
  }
`;

const LogoutButton = styled.div`
  font-weight: 500;
  font-size: 25px;
`;

const ChatList = () => {
  const { user, clearLocalStorage } = useContext(
    UserContext,
  ) as UserContextType;
  const [chats, setChats] = useState<Chat[]>([]);
  const users: User[] = chats.map((chat) => {
    return chat.users[0];
  });
  const lastMessages = chats.map((chat) => {
    return chat.messages[0];
  });

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/chats/${user?.userId}`, {
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

  return (
    <Wrapper>
      <Layout>
        <Chats>
          <Header>
            <Pfp src={PfP} alt="" />
            <Search>
              <SearchInput type="text" placeholder="Search" />
            </Search>
          </Header>
          <List>
            {users.map((user, index) => {
              const message = lastMessages[index]?.content;
              const sentAt = format(
                new Date(lastMessages[index]?.createdAt || ""),
                "P",
              );

              return (
                <ChatLink key={user.id} to={`/chats/${chats[index].id}`}>
                  <Chat>
                    <Pfp src={user.profilePictureUrl} alt="Pfp" />
                    <ChatInfo>
                      <UserInfo>
                        <Username>{user.username}</Username>
                        <LastMessageTime>{sentAt}</LastMessageTime>
                      </UserInfo>
                      <LastMessage>{message}</LastMessage>
                    </ChatInfo>
                  </Chat>
                </ChatLink>
              );
            })}
          </List>

          <Footer>
            <Logout>
              <TbLogout size={25} />
              <LogoutButton onClick={onLogout}>Logout</LogoutButton>
            </Logout>
          </Footer>
        </Chats>

        <Outlet />
      </Layout>
    </Wrapper>
  );
};

export default ChatList;
