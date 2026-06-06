import express from "express";
import userController from "../controllers/user.ts";

const router = express.Router();

router.get("/", userController.usersGet);

export default router;