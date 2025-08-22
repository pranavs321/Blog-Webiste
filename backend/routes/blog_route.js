import express from "express";
import { createBlog, getBlogs } from "../controller/blog_controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
router.get("/", getBlogs);

export default router;
