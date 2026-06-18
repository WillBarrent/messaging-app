import prisma from "../db/prisma.ts";
import type { PlainUser } from "../types";

const getAllUsers = async (): Promise<PlainUser[]> => {
  const users = await prisma.user.findMany({});

  return users.map(({ id, username }) => ({ id, username }));
};

const getAllUsersChats = async ({ userId }: { userId: number }) => {
  const chats = await prisma.chat.findMany({
    where: {
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

  return chats;
};

export default { getAllUsers, getAllUsersChats };
