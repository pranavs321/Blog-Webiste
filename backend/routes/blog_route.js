import express from "express";
import { createBlog, getBlogs } from "../controller/blog_controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create", isAuthenticated, createBlog);

export default router;
