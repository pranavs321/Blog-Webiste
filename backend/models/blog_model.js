import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    about: { type: String, required: true, minlength: 20 },
    category: { type: String, required: true },
    blogImage: {
      public_id: { type: String },
      url: { type: String },
    },
    // author info (filled from req.user)
    adminName: String,
    adminPhoto: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
