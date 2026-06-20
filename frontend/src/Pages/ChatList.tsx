import { Link, Outlet } from "react-router";
import type { Message, User } from "../types";
import styled from "styled-components";

import PfP from "../assets/pfp.jpeg";
import { format } from "date-fns";

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

const ChatList = ({
  users,
  lastMessages,
}: {
  users: User[];
  lastMessages: (Message | undefined)[];
}) => {
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
                <ChatLink key={user.id} to={`/chats/${user.id}`}>
                  <Chat>
                    <Pfp src={PfP} alt="" />
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
        </Chats>

        <Outlet />
      </Layout>
    </Wrapper>
  );
};

export default ChatList;
