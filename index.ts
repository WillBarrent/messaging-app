import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.ts";
import messagesRouter from "./routes/messages.ts";
import passport from "passport";
import JwtStrategy from "./passport.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
passport.use(JwtStrategy);

app.use("/auth", authRouter);
app.use("/messages", messagesRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on PORT", PORT);
});
