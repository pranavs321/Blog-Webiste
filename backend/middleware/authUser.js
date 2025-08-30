import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const isAuthenticated = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  console.log("🔑 Incoming Authorization:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // attach to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
export const isAdmin = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  };
};