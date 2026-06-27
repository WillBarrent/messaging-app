import type { NextFunction, Request, Response } from "express";
import type { PlainUser } from "../types";
import jwt from "jsonwebtoken";
import userModel from "../models/user.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const usersGet = async (_req: Request, res: Response<PlainUser[]>) => {
  const users = await userModel.getAllUsers();

  res.json(users);
};

const userProfilePut = async (
  req: Request<unknown, unknown, { username: string; pfpUrl: string }>,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token?.split("Bearer ")[1] || "");
  const userId = decodedToken?.sub;
  const { username, pfpUrl } = req.body;

  try {
    const user = await userModel.updateUserById({
      userId: Number(userId),
      username,
      profilePictureUrl: pfpUrl,
    });

    res.json({
      user,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(400).json({
          error: "User was not found",
        });
      } else {
        next(error);
      }
    }
  }
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

export default { usersGet, userByChatIdGet, userProfilePut };
