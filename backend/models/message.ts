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
      receiver: { connect: { id: receiverId } },
      sender: { connect: { id: senderId } },
    },
  });

  const chat = await prisma.chat.findFirst({
    where: {
      users: {
        every: {
          OR: [{ id: receiverId }, { id: senderId }],
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
          connect: [{ id: senderId }, { id: receiverId }],
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
          connect: [{ id: senderId }, { id: receiverId }],
        },
      },
    });
  }

  return message;
};

const updateMessage = async ({
  id,
  content,
}: {
  id: number;
  content: string;
}) => {
  const updatedMessage = await prisma.message.update({
    where: {
      id: Number(id),
    },
    data: {
      content,
    },
  });

  return updatedMessage;
};

const deleteMessage = async ({ id }: { id: number }) => {
  await prisma.message.delete({
    where: {
      id,
    },
  });
};

export default { createMessage, getMessages, updateMessage, deleteMessage };
