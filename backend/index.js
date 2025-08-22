import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import userRoute from "./routes/user_route.js";
import blogRoute from "./routes/blog_route.js";
import "./utils/cloudinary.js"; // just to ensure config runs

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// core middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS (allow cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// file upload (supports req.files.photo, req.files.blogImage)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// routes
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.get("/", (_req, res) => res.send("🚀 API up"));

// connect DB + start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  });
