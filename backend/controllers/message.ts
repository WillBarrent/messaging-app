import { type Response, type Request, type NextFunction } from "express";
import type { Message, NewMessage } from "../types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import jwt from "jsonwebtoken";
import messageModel from "../models/message.ts";

const messagesGet = async (req: Request<{ chatId: string }>, res: Response) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.decode(token?.split("Bearer ")[1] || "");
  const { chatId } = req.params;

  if (decodedToken !== null) {
    const chat = await messageModel.getChatMessagesById({
      chatId: Number(chatId),
      userId: Number(decodedToken.sub),
    });
    res.json(chat);
  }
};

const messagePost = async (
  req: Request<unknown, unknown, NewMessage>,
  res: Response<Message>,
) => {
  const newMessage = await messageModel.createMessage(req.body);

  res.json(newMessage);
};

const messagePut = async (
  req: Request<{ id: string }, unknown, NewMessage>,
  res: Response<Message>,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedMessage = await messageModel.updateMessage({
      id: Number(id),
      content,
    });

    res.json(updatedMessage);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error instanceof PrismaClientKnownRequestError
    ) {
      res.status(404).end(
        JSON.stringify({
          error: "Failed to update message: Message doesn't exist",
        }),
      );
    } else {
      next(error);
    }
  }
};

const messageDelete = async (
  req: Request<{ id: string }, unknown, unknown>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await messageModel.deleteMessage({ id: Number(id) });

    res.json({
      message: "Message has been removed",
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error instanceof PrismaClientKnownRequestError
    ) {
      res.status(404).end(
        JSON.stringify({
          error: "Failed to delete message: Message doesn't exist",
        }),
      );
    } else {
      next(error);
    }
  }
};

export default {
  messagePost,
  messagesGet,
  messagePut,
  messageDelete,
};
