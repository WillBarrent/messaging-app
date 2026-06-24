import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import chatModel from "../models/chat.ts";

const chatsGet = async (req: Request<{ userId: string }>, res: Response) => {
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
    const chat = await chatModel.getAllUsersChats({ userId: Number(userId) });

    res.json(chat);
  }
};

export default { chatsGet };
