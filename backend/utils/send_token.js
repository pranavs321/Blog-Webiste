import jwt from "jsonwebtoken";

const sendToken = (user, res, message = "Success") => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // ✅ return JSON (not cookie)
  return res.status(200).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      education: user.education,
    },
  });
};

export default sendToken;
