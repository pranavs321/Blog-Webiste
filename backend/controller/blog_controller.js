import Blog from "../models/blog_model.js";

// CREATE BLOG (auth + admin)
export const createBlog = async (req, res) => {
  try {
    const { title, category, about } = req.body;

    if (!title || !category || !about) {
      return res.status(400).json({ message: "title, category, about are required" });
    }

    const blog = await Blog.create({
      title,
      category,
      about,
      adminName: req.user?.name,
      adminPhoto: req.user?.photo?.url,
      createdBy: req.user?._id,
      // No blogImage field at all
    });

    return res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error("Create blog error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // get from URL

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
