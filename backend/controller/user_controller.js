import { User } from "../models/user_model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
export const register = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "User photo is required" });
  }

  const { photo } = req.files;
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedFormats.includes(photo.mimetype)) {
    return res.status(400).json({ message: "Invalid image format" });
  }

  const { email, name, password, phone, education, role } = req.body;

  if (!email || !name || !password || !phone || !education || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary upload error:",
        cloudinaryResponse.error || "Unknown error"
      );
      return res.status(500).json({ message: "Image upload failed" });
    }

    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(password,saltRounds);


    // Create and save new user
    const newUser = new User({
      email,
      name,
      password:hashedPassword,
      phone,
      education,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", newUser });
  } catch (err) {
    console.error("Error in register:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill required fields" });
    }

    const user = await User.findOne({ email }).select("+password role name email");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "User password is missing" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: `Given role ${role} not found` });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  // If you are using sessions
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Could not log out. Try again." });
      } else {
        return res.status(200).json({ message: "Logged out successfully" });
      }
    });
  } else {
    // If no sessions, just respond
    return res.status(200).json({ message: "Logged out successfully" });
  }
};
