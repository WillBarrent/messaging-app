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

export default { getAllUsers, getUserByChatId };
