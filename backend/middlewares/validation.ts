import type { NextFunction, Request, Response } from "express";
import { NewMessageSchema, NewUserSchema } from "../types.ts";

const newUserValidator = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewUserSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const newMessageValidator = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    NewMessageSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default { newUserValidator, newMessageValidator };
