import express from "express";
import type { Request, Response } from "express";
import type { NewUser, User } from "../types.ts";
import authModel from "../models/auth.ts";

const router = express.Router();

router.post(
  "/register",
  async (req: Request<unknown, unknown, NewUser>, res: Response<User>) => {
    const { username, password } = req.body;

    const newUser = await authModel.createUser({ username, password });

    res.json(newUser);
  },
);

export default router;
