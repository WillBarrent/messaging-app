import type { Request, Response } from "express";
import type { NewUser, User } from "../types.ts";
import { createJWT, hashPassword, validatePassword } from "../utils.ts";
import authModel from "../models/auth.ts";

const signUpPost = async (
  req: Request<unknown, unknown, NewUser>,
  res: Response,
) => {
  const { username, password } = req.body;

  const hashedPassword = await hashPassword(password);
  const newUser = await authModel.createUser({
    username,
    password: hashedPassword,
  });

  res.json(newUser);
};

const loginPost = async (
  req: Request<unknown, unknown, NewUser>,
  res: Response,
) => {
  const { username, password } = req.body;
  const user: User | null = await authModel.getUserByUsername({ username });

  if (user) {
    const isPasswordValid = await validatePassword(password, user.password);
    if (isPasswordValid) {
      const { token, userId, username } = createJWT(user);
      res.json({
        token,
        userId,
        username,
      });
    } else {
      res.status(401).json({
        error: "Password is not correct",
      });
    }
  } else {
    res.status(401).json({
      error: "user with given credentials doesn't exist",
    });
  }
};

export default { signUpPost, loginPost };
