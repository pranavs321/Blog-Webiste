import User from "../models/user_model.js";
import cloudinary from "../utils/cloudinary.js";
import sendToken from "../utils/send_token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, education } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // optional photo via file upload or base64
    let photoData = {};
    if (req.files?.photo) {
      const uploaded = await cloudinary.uploader.upload(req.files.photo.tempFilePath);
      photoData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    } else if (req.body.photoBase64) {
      const uploaded = await cloudinary.uploader.upload(req.body.photoBase64);
      photoData = { public_id: uploaded.public_id, url: uploaded.secure_url };
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      phone,
      education,
      photo: photoData,
    });

    return sendToken(user, res, "User registered successfully");
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    if (role && user.role !== role) {
      return res.status(400).json({ message: `Given role ${role} not found` });
    }

    return sendToken(user, res, "User logged in successfully");
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const logout = (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const myProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

export const getAdmins=async (req,res) => {
  const admin=await User.find({role:"admin"});
  res.status(200).json(admin);
};