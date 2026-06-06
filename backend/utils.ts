import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import type { Payload, User } from "./types";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isCorrect = await bcrypt.compare(password, hashedPassword);

  return isCorrect;
};

export const createJWT = (user: User): { token: string; userId: number, username: string } => {
  const _id = user.id;
  const payload: Payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    process.env.SECRET_JWT_KEY as string,
  );

  return {
    token: "Bearer " + signedToken,
    userId: _id,
    username: user.username
  };
};
