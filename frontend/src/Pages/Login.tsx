import React, { useContext, useState } from "react";
import UserContext, { type UserContextType } from "../UserContext";

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
    <div>
      <h1>Login Page</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            username
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
