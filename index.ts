import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on PORT", PORT);
});
