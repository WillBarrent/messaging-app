import type { Request, Response } from "express";
import type { PlainUser } from "../types";
import userModel from "../models/user.ts";

const usersGet = async (_req: Request, res: Response<PlainUser[]>) => {
  const users = await userModel.getAllUsers();

  res.json(users);
};

export default { usersGet };
