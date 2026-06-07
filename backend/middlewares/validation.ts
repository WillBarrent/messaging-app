import type { NextFunction, Request, Response } from "express";
import { NewUserSchema } from "../types.ts";

const newUserValidator = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default { newUserValidator };
