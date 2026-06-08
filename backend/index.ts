import "dotenv/config";
import express from "express";
import passport from "passport";
import cors from "cors";
import { createServer } from "http";
import JwtStrategy from "./passport.ts";
import authRouter from "./routes/auth.ts";
import messageRouter from "./routes/message.ts";
import userRouter from "./routes/user.ts";
import errorHandlers from "./middlewares/error.ts";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
passport.use(JwtStrategy);

app.use("/auth", authRouter);
app.use("/messages", messageRouter);
app.use("/users", userRouter);

app.use(errorHandlers);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on PORT", PORT);
});
