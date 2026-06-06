import express from "express";
import messageController from "../controllers/message.ts";

const router = express.Router();

router.get("/:senderId/:receiverId", messageController.messagesGet);

router.post("/", messageController.messageUserPost);

export default router;
