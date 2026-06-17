import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import styled from "styled-components";

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

const SignUpForm = styled.form`
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
  border: 1px solid black;
  padding: 5px 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 3px solid black;
  }
`;

const Paragraph = styled.p`
  text-align: center;
`;

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await fetch("http://localhost:3000/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    navigate("/login");
  };

  return (
    <Wrapper>
      <Layout>
        <Title>Create Account</Title>
        <SignUpForm onSubmit={onSubmit}>
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
          <Button type="submit">Sign Up</Button>
          <Paragraph>
            Have an account? <Link to={"/login"}>Login</Link>
          </Paragraph>
        </SignUpForm>
      </Layout>
    </Wrapper>
  );
};

export default SignUp;
