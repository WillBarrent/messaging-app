import express from "express";
import routerController from "../controllers/auth.ts";
import validator from "../middlewares/validation.ts";

const router = express.Router();

router.post(
  "/sign-up",
  validator.newUserValidator,
  routerController.signUpPost,
);

router.post("/login", routerController.loginPost);

export default router;
