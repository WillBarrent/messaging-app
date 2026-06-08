import express, { type RequestHandler } from "express";
import userController from "../controllers/user.ts";
import passport from "passport";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  userController.usersGet,
);

router.get(
  "/chats/:userId",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  userController.usersChatsGet,
);

export default router;
