import { Blog } from "../models/blog_model.js";
import { v2 as cloudinary } from "cloudinary";

export const createBlog = async (req, res) => {
  // Check if blogImage exists
  if (!req.files || !req.files.blogImage) {
    return res.status(400).json({ message: "Blog image is required" });
  }

  const { blogImage } = req.files;
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  // Validate image format
  if (!allowedFormats.includes(blogImage.mimetype)) {
    return res.status(400).json({ message: "Invalid image format" });
  }

  const { title, category, about } = req.body;

  // Validate required fields
  if (!title || !category || !about) {
    return res.status(400).json({ message: "Title, category, and about are required" });
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary upload error:", cloudinaryResponse.error || "Unknown error");
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Prepare blog data (without user info)
    const blogData = {
      title,
      about,
      category,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    };

    // Create and save the blog
    const blog = await Blog.create(blogData);

    return res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error in createBlog:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
