import { type Response, type Request } from "express";
import type { Message, NewMessage } from "../types";
import messageModel from "../models/message.ts";

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
) => {
  const { id } = req.params;
  const { content } = req.body;

  const updatedMessage = await messageModel.updateMessage({
    id: Number(id),
    content,
  });

  res.json(updatedMessage);
};

const messageDelete = async (
  req: Request<{ id: string }, unknown, unknown>,
  res: Response,
) => {
  const { id } = req.params;

  await messageModel.deleteMessage({ id: Number(id) });

  res.json({
    message: "Message has been removed",
  });
};

export default {
  messagePost,
  messagesGet,
  messagePut,
  messageDelete,
};
