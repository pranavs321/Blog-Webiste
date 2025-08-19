import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  blogImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
  category: { type: String, required: true },
  about: { type: String, required: true, minlength: [20, "Should contain at least 20 characters"] },
  createdAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.model("Blog", blogSchema);
