import express, { type RequestHandler } from "express";
import messageController from "../controllers/message.ts";
import passport from "passport";
const router = express.Router();

router.get(
  "/:senderId/:receiverId",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  messageController.messagesGet,
);

router.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  messageController.messagePost,
);

router.put(
  "/:id",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  messageController.messagePut,
);

router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  messageController.messageDelete,
);

export default router;
