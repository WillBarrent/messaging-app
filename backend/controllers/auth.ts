import type { NextFunction, Request, Response } from "express";
import { type NewUser, type User } from "../types.ts";
import { createJWT, hashPassword, validatePassword } from "../utils.ts";
import authModel from "../models/auth.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const signUpPost = async (
  req: Request<unknown, unknown, NewUser>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await hashPassword(password);
    const newUser = await authModel.createUser({
      username,
      password: hashedPassword,
    });

    res.json(newUser);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({
          error: "Username has already been taken.",
        });
      }
    } else {
      next(err);
    }
  }
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
      error: "User with given credentials doesn't exist",
    });
  }
};

export default { signUpPost, loginPost };
