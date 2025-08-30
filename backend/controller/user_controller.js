import User from "../models/user_model.js";
import cloudinary from "../utils/cloudinary.js";
import sendToken from "../utils/send_token.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, education } = req.body;

    if (!name || !email || !phone || !password || !role || !education) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      education,
      role,
      password: hashedPassword,
    });

    // ✅ send token response
    return sendToken(user, res, "Registered successfully");
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if email + password are given
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // 2. find user by email (explicitly select password field)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 3. check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // 4. login success → send token + ALL user info
    const token = sendToken(user, res, "Login successful"); // sendToken already attaches token + user

    // OR if you want to manually control:
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        education: user.education,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


    
// LOGOUT
export const logout = (_req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

// PROFILE
export const myProfile = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

// GET ADMINS
export const getAdmins = async (_req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
