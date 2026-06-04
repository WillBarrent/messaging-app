import prisma from "../db/prisma.ts";
import type { NewUser, User } from "../types.ts";

const createUser = async ({ username, password }: NewUser): Promise<User> => {
  const user: User = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  return user;
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

const getUserByUsername = async ({ username }: { username: string }) => {
  const user: User | null = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export default { createUser, getUserById, getUserByUsername };
