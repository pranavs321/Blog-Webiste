import jwt from "jsonwebtoken";

const sendToken = (user, res, message = "Success") => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // No cookies! Only token in JSON response
  return res.status(200).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo?.url || null,
    },
  });
};

export default sendToken;
