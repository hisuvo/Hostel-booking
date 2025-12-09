import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(cors());

// middleware
app.use(express.json());
app.use(clerkMiddleware());

// database function call
connectDB();

app.get("/", (req, res) => {
  res.send("API is working");
});

// server error
app.use((req, res, next) => {
  res.status(500).json({
    success: false,
    message: "server internal error",
  });
  next();
});

export default app;
