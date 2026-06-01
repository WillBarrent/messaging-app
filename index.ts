import "dotenv/config";
import express from "express";
import prisma from "./db/prisma.ts";

const app = express();

app.get("/create", async (_req, res) => {
  const message = await prisma.message.create({ data: {
    content: "Second message",
  } });

  res.json(message);
});

app.get("/", async (_req, res) => {
  const messages = await prisma.message.findMany({});
  res.json(messages);
});

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on PORT", PORT);
});
