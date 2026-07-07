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
          profilePictureUrl: true,
        },
      },
    },
  });

  return chats;
};

const createChat = async ({
  senderId,
  receiverId,
}: {
  senderId: number;
  receiverId: number;
}) => {
  const chat = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: receiverId }, { id: senderId }],
      },
    },
    include: {
      users: {
        where: {
          NOT: {
            id: senderId,
          },
        },
        select: {
          id: true,
          username: true,
          profilePictureUrl: true,
        },
      },
    },
  });

  return chat;
};

export default { getAllUsersChats, createChat };
