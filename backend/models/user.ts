import prisma from "../db/prisma.ts";
import type { PlainUser } from "../types";

const getAllUsers = async (): Promise<PlainUser[]> => {
  const users = await prisma.user.findMany({});

  return users.map(({ id, username }) => ({ id, username }));
};

export default { getAllUsers };
