import express from "express";
import chatController from "../controllers/chat.ts";

const router = express.Router();

router.get("/:userId", chatController.chatsGet);

export default router;
