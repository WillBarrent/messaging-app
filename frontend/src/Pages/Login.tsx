import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";
import { Link } from "react-router";

const Wrapper = styled.div`
  height: 100vh;
`;

const Layout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const LoginForm = styled.form`
  border: 1px solid black;
  width: 500px;
  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  display: flex;
  gap: 5px;
  flex-direction: column;
  font-size: 20px;
`;

const Input = styled.input`
  font-family: inherit;
  font-size: 15px;
  outline: none;
  border: 1px solid black;
  padding: 5px 10px;
`;

const Button = styled.button`
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  border: 1px solid black;
  padding: 5px 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #282828;
  }
`;

const Paragraph = styled.p`
  text-align: center;
`;

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setLocalStorage } = useContext(UserContext) as UserContextType;

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const request = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await request.json();

    if (
      "object" === typeof data &&
      Object.keys(data).includes("token") &&
      Object.keys(data).includes("userId") &&
      Object.keys(data).includes("username")
    ) {
      setLocalStorage(data);
    }
  };

  return (
    <Wrapper>
      <Layout>
        <Title>Login</Title>
        <LoginForm onSubmit={onSubmit}>
          <Label>
            Username
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Label>
          <Label>
            Password
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Label>
          <Button type="submit">Login</Button>
          <Paragraph>
            Don't have account? <Link to={"/sign-up"}>Create account</Link>
          </Paragraph>
        </LoginForm>
      </Layout>
    </Wrapper>
  );
};

export default Login;
