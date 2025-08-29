import jwt from "jsonwebtoken";
import User from "../models/user_model.js";


export const isAuthenticated = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  console.log("🔑 Incoming Authorization:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // If it already starts with Bearer, split it. Else treat whole string as token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
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

