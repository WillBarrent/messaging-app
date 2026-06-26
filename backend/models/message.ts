import prisma from "../db/prisma.ts";
import type { Message, NewMessage } from "../types";

const getChatMessagesById = async ({
  chatId,
  userId,
}: {
  chatId: number;
  userId: number;
}) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return chat;
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

export default {
  createMessage,
  getChatMessagesById,
  updateMessage,
  deleteMessage,
};
