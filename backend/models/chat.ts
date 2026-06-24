import prisma from "../db/prisma.ts";

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

export default { getAllUsersChats };
