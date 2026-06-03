import type { Request, Response } from "express";
import type { NewUser, User } from "../types.ts";
import { createJWT, hashPassword, validatePassword } from "../utils.ts";
import authModel from "../models/auth.ts";
import prisma from "../db/prisma.ts";

const signUpPost = async (
  req: Request<unknown, unknown, NewUser>,
  res: Response<User>,
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
  res: Response<{ token: string }>,
) => {
  const { username, password } = req.body;
  const user: User | null = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (user) {
    const isPasswordValid = await validatePassword(password, user.password);
    if (isPasswordValid) {
      const { token } = createJWT(user);
      res.json({
        token,
      });
    }
  }
};

export default { signUpPost, loginPost };
