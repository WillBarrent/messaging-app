import { Link, Outlet, useNavigate } from "react-router";
import type { Chat, User, UserContextType } from "../types";
import styled from "styled-components";
import { TbLogout } from "react-icons/tb";
import { format } from "date-fns";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

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
  height: 40px;
  border-radius: 50%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;

  border-bottom: 5px solid;
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
`;

const Chat = styled.div`
  border: 3px solid black;
  padding: 5px 10px;

  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
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

const NoChats = styled.div`
  text-align: center;
  font-weight: 300;
  font-size: 20px;
`;

const SearchForm = styled.form`
  width: 100%;
  margin-bottom: 0;

  display: flex;
`;

const SearchInput = styled.input`
  flex: 1;
  outline: none;
  border: 3px solid black;
  border-right: 0px;
  padding: 5px;
  font-family: inherit;
  font-size: 15px;
`;

const SearchSubmitButton = styled.button`
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

const SearchSubmitButtonWrapper = styled.div`
  padding: 5px;
  border: 3px solid black;
  border-left: 0px;
`;

const ChatList = () => {
  const { user, clearLocalStorage } = useContext(
    UserContext,
  ) as UserContextType;

  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchUsers, setSearchUsers] = useState<User[]>([]);

  const navigate = useNavigate();
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

    navigate("/login");
  };

  const onSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/users", {
      headers: {
        Authorization: user?.token || "",
      },
    });

    const usersData = await request.json();

    const properUsers = usersData.filter((user: User) => {
      if (
        !users
          .map((user) => user.username.toLowerCase())
          .includes(user.username.toLowerCase()) &&
        search.length !== 0 &&
        user.username.toLowerCase().startsWith(search.toLowerCase())
      ) {
        return true;
      }

      return false;
    });

    setSearch("");
    setSearchUsers(properUsers);
  };

  const onClose = (e: React.SyntheticEvent) => {
    e.preventDefault();

    setSearch("");
    setSearchUsers([]);
  };

  return (
    <Wrapper>
      <Layout>
        <Chats>
          <Header>
            <Link to={"/profile"}>
              <Pfp src={user?.pfpUrl} alt="" />
            </Link>
            <SearchForm
              onSubmit={searchUsers.length === 0 ? onSearch : onClose}
            >
              <SearchInput
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <SearchSubmitButtonWrapper>
                <SearchSubmitButton type="submit">
                  {searchUsers.length === 0 ? (
                    <RiSendPlaneFill size={20} color="#fff" />
                  ) : (
                    <IoMdClose size={20} color="#fff" />
                  )}
                </SearchSubmitButton>
              </SearchSubmitButtonWrapper>
            </SearchForm>
          </Header>

          <List>
            {searchUsers.length === 0 && users.length === 0 ? (
              <NoChats>Find someone to chat!</NoChats>
            ) : null}

            {searchUsers.length !== 0 &&
              searchUsers.map((user) => {
                return (
                  <Chat>
                    <Pfp src={user.profilePictureUrl} alt="Pfp" />
                    <ChatInfo>
                      <UserInfo>
                        <Username>{user.username}</Username>
                      </UserInfo>
                    </ChatInfo>
                  </Chat>
                );
              })}

            {searchUsers.length === 0 &&
              users.map((user, index) => {
                const message = lastMessages[index]?.content;
                const sentAt = lastMessages[index]
                  ? format(new Date(lastMessages[index]?.createdAt || ""), "P")
                  : "";

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
