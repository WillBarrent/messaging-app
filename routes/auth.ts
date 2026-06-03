import express from "express";
import routerController from "../controllers/auth.ts";

const router = express.Router();

router.post("/sign-up", routerController.signUpPost);

router.post("/login", routerController.loginPost);

export default router;
