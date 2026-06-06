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

const messageUserPost = async (
  req: Request<unknown, unknown, NewMessage>,
  res: Response<Message>,
) => {
  const newMessage = await messageModel.createMessage(req.body);

  res.json(newMessage);
};

export default { messageUserPost, messagesGet };
