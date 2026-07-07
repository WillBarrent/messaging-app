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

const Errors = styled.ul<{ $errors?: string[] | null }>`
  padding: 10px 25px;
  background-color: rgba(255, 0, 0, 0.25);
  color: rgb(255, 0, 0);
  font-size: 15px;
  font-weight: bold;
  display: ${(props) => (props.$errors ? "flex" : "none")};
  flex-direction: column;
  gap: 5px;
`;

const Error = styled.li``;

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[] | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const request = await fetch(`${SERVER_URL}/auth/sign-up`, {
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

    if (!Object.keys(data).includes("error")) {
      navigate("/login");
    } else {
      if (typeof data.error === "string") {
        setErrors([data.error]);
      } else {
        setErrors(
          data.error.def.map((error: { message: string }) => error.message),
        );
      }

      setTimeout(() => {
        setErrors(null);
      }, 3000);
    }
  };

  return (
    <Wrapper>
      <Layout>
        <Title>Create Account</Title>
        <SignUpForm onSubmit={onSubmit}>
          <Errors $errors={errors}>
            {errors?.map((error) => {
              return <Error key={error}>{error}</Error>;
            })}
          </Errors>
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
