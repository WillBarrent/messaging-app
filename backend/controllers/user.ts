import type { Request, Response } from "express";
import type { PlainUser } from "../types";
import userModel from "../models/user.ts";
import jwt from "jsonwebtoken";

const usersGet = async (_req: Request, res: Response<PlainUser[]>) => {
  const users = await userModel.getAllUsers();

  res.json(users);
};

const usersChatsGet = async (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token?.split("Bearer ")[1] || "");

  const { userId } = req.params;

  if (
    decodedToken !== null &&
    typeof decodedToken.sub === "number" &&
    decodedToken.sub !== Number(userId)
  ) {
    res.status(401).json({
      error: "You are not allowed to see other people's chats",
    });
  } else {
    const chat = await userModel.getAllUsersChats({ userId: Number(userId) });

    res.json(chat);
  }
};

export default { usersGet, usersChatsGet };
