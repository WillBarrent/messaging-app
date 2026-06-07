import type { NextFunction, Request, Response } from "express";

const errorMessage = "You are not authenticated";

const authMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === "AuthenticationError") {
    res.status(401).json({
      error: errorMessage,
    });
  }

  next(err);
};

export default authMiddleware;
