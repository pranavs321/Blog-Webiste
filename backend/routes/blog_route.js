// backend/routes/blog_route.js
import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlogs,
  getMyBlogs,
  updateBlog,
} from "../controller/blog_controller.js";
import { isAdmin, isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Create blog (only admins)
router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);

// Delete blog (only admins)
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);

// Get all blogs (public route)
router.get("/all-blogs", getAllBlogs);

// Get a single blog (public route)
router.get("/single-blog/:id", getSingleBlogs);

// Get blogs created by logged-in admin
router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);

// Update blog (only admins)
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);

export default router;
