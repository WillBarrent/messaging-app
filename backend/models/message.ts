import prisma from "../db/prisma.ts";
import type { Message, NewMessage } from "../types";

const getMessages = async ({
  receiverId,
  senderId,
}: {
  receiverId: number;
  senderId: number;
}) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          receiverId: receiverId,
          senderId: senderId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    },
    include: {
      receiver: {
        select: {
          username: true,
        },
      },
      sender: {
        select: {
          username: true,
        },
      },
    },
  });

  return messages;
};

const createMessage = async ({
  content,
  receiverId,
  senderId,
}: NewMessage): Promise<Message> => {
  const message = await prisma.message.create({
    data: {
      content,
      receiver: { connect: { id: receiverId as number } },
      sender: { connect: { id: senderId as number } },
    },
  });

  const chat = await prisma.chat.findFirst({
    where: {
      users: {
        every: {
          OR: [{ id: receiverId as number }, { id: senderId as number }],
        },
      },
    },
  });

  if (!chat) {
    await prisma.chat.create({
      data: {
        messages: {
          connect: { id: message.id },
        },
        users: {
          connect: [{ id: senderId as number }, { id: receiverId as number }],
        },
      },
    });
  } else {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        messages: {
          connect: { id: message.id },
        },
        users: {
          connect: [{ id: senderId as number }, { id: receiverId as number }],
        },
      },
    });
  }

  return message;
};

export default { createMessage, getMessages };
