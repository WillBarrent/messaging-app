import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const authMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === "AuthenticationError") {
    res.status(401).json({
      error: "You are not authenticated",
    });
  } else if (err instanceof ZodError) {
    res.status(400).json({
      error: err._zod
    });
  } else {
    next(err);
  }
};

const errorHandlers = [authMiddleware];

export default errorHandlers;
