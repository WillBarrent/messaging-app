import prisma from "../db/prisma.ts";
import type { PlainUser } from "../types";

const getAllUsers = async (): Promise<PlainUser[]> => {
  const users = await prisma.user.findMany({});

  return users.map(({ id, username }) => ({ id, username }));
};

const getUserByChatId = async ({
  chatId,
  userId,
}: {
  chatId: number;
  userId: number;
}) => {
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
    },
    include: {
      users: {
        where: {
          NOT: {
            id: userId,
          },
        },
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (chat === null) return null;

  return chat.users[0];
};

const updateUserById = async ({
  userId,
  username,
  profilePictureUrl,
}: {
  userId: number;
  username: string;
  profilePictureUrl: string;
}) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      profilePictureUrl,
    },
  });

  return user;
};

export default { getAllUsers, getUserByChatId, updateUserById };
