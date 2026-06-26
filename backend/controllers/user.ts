import type { Request, Response } from "express";
import type { PlainUser } from "../types";
import jwt from "jsonwebtoken";
import userModel from "../models/user.ts";

const usersGet = async (_req: Request, res: Response<PlainUser[]>) => {
  const users = await userModel.getAllUsers();

  res.json(users);
};

const userByChatIdGet = async (
  req: Request<{ chatId: string }>,
  res: Response,
) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token?.split("Bearer ")[1] || "");
  const { chatId } = req.params;

  if (decodedToken !== null && typeof decodedToken.sub === "number") {
    const users = await userModel.getUserByChatId({
      chatId: Number(chatId),
      userId: Number(decodedToken.sub),
    });

    res.json(users);
  }
};

export default { usersGet, userByChatIdGet };
