import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("✅ Token found in Authorization header");
    }

    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
      console.log("✅ Token found in cookies (fallback)");
    }

    if (!token) {
      console.log("❌ No token found, blocking request");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    console.log(`🎉 Auth success via token for user: ${user.email}`);
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
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
