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

router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", getSingleBlogs);

router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
router.put("/update/:id", isAuthenticated, isAdmin("admin"), updateBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);

router.get("/my-blog", isAuthenticated, isAdmin("admin"), getMyBlogs);

export default router;


