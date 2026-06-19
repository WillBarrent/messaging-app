import { useContext } from "react";
import { Link } from "react-router";
import styled from "styled-components";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";

const Wrapper = styled.div`
  height: 100vh;
`;

const Page = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  border: 5px solid black;
  padding: 20px;
`;

const NotFoundText = styled.div`
  font-weight: 600;
  font-size: 30px;
`;

const BackLink = styled(Link)`
  font-size: 20px;

  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const NotFound = () => {
  const { user } = useContext(UserContext) as UserContextType;
  const isLoggedIn = user?.token ? true : false;

  return (
    <Wrapper>
      <Page>
        <Info>
          <NotFoundText>404. Page is not found.</NotFoundText>
          <BackLink to={isLoggedIn ? "/chats" : "/login"}>
            Back to {isLoggedIn ? "chats" : "login page"}
          </BackLink>
        </Info>
      </Page>
    </Wrapper>
  );
};

export default NotFound;
