import mongoose from "mongoose";
import Blog from "../models/blog_model.js";

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

export const getAllBlogs= async(req,res)=>{
  try{
    const blogs=await Blog.find().sort({createdAt:-1});
    res.status(200).json(blogs);
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Server Error"});
  }
};  

export const getSingleBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const createdBy = req.user._id; 
    const myBlogs = await Blog.find({ createdBy }); 
    res.status(200).json(myBlogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

export const updateBlog = async (req,res) => {
  const {id} = req.params;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({message:"Invalid Blog ID"});
  }
  const updateBlog= await Blog.findByIdAndUpdate(id,req.body,{new:true});
  if(!updateBlog){
    return res.status(404).json({message:"Blog not found"});
  }
res.status(200).json(updateBlog);
};

export const getAdmins=async (req,res) => {
  const admin=await user.find({role:"admin"});
  res.status(200).json(admin);
};