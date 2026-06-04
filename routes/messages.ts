import express, { type Response, type Request } from "express";
import prisma from "../db/prisma.ts";

const router = express.Router();

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
}

type NewMessage = Omit<Message, "id">;

router.post(
  "/",
  async (req: Request<unknown, unknown, NewMessage>, res: Response) => {
    const { senderId, receiverId, content } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        content,
        receiver: { connect: { id: receiverId } },
        sender: { connect: { id: senderId } },
      },
    });

    res.json(newMessage);
  },
);

export default router;
