import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ error: "User not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `User with role '${req.user.role}' not allowed` });
    }
    next();
  };
};
