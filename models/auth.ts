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

export default { createUser };
