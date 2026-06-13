import { type Response, type Request, type NextFunction } from "express";
import type { Message, NewMessage } from "../types";
import messageModel from "../models/message.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const messagesGet = async (
  req: Request<{ receiverId: string; senderId: string }, unknown, string>,
  res: Response,
) => {
  const { receiverId, senderId } = req.params;

  const messages = await messageModel.getMessages({
    receiverId: Number(receiverId),
    senderId: Number(senderId),
  });

  res.json(messages);
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
