import express, { type RequestHandler } from "express";
import chatController from "../controllers/chat.ts";
import passport from "passport";

const router = express.Router();

router.get(
  "/:userId",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  chatController.chatsGet,
);
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  }) as RequestHandler,
  chatController.chatsPost,
);

export default router;
