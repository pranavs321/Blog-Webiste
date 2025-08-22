import Blog from "../models/blog_model.js";
import cloudinary from "../utils/cloudinary.js";

// CREATE BLOG (auth + admin)
export const createBlog = async (req, res) => {
  try {
    const { title, category, about } = req.body;

    if (!title || !category || !about) {
      return res.status(400).json({ message: "title, category, about are required" });
    }

    // image from file upload or base64
    let imageData = {};
    if (req.files?.blogImage) {
      const uploaded = await cloudinary.uploader.upload(req.files.blogImage.tempFilePath);
      imageData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    } else if (req.body.blogImageBase64) {
      const uploaded = await cloudinary.uploader.upload(req.body.blogImageBase64);
      imageData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const blog = await Blog.create({
      title,
      category,
      about,
      blogImage: imageData,
      adminName: req.user?.name,
      adminPhoto: req.user?.photo?.url,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Create blog error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBlogs = async (_req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return res.status(200).json({ blogs });
};
