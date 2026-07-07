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
  font-weight: bold;
  outline: none;
  border: 3px solid black;
  padding: 5px 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const Paragraph = styled.p`
  text-align: center;
`;

const Error = styled.div<{ $error?: string | null }>`
  display: ${(props) => (props.$error ? "block" : "none")};
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.25);
  color: rgb(255, 0, 0);
  font-weight: bold;
`;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setLocalStorage } = useContext(UserContext) as UserContextType;

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const request = await fetch(`${SERVER_URL}/auth/login`, {
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
      Object.keys(data).includes("token")
    ) {
      setLocalStorage(data);
    } else if (
      "object" === typeof data &&
      Object.keys(data).includes("error")
    ) {
      setError(data.error as string);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <Wrapper>
      <Layout>
        <Title>Login</Title>
        <LoginForm onSubmit={onSubmit}>
          <Error $error={error}>{error}</Error>
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
