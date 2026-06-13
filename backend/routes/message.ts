import express, { type RequestHandler } from "express";
import messageController from "../controllers/message.ts";
import passport from "passport";
import validator from "../middlewares/validation.ts";
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
  validator.newMessageValidator,
  messageController.messagePost,
);

router.put(
  "/:id",
  validator.newMessageValidator,
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
