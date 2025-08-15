import { User } from "../models/user_model.js";
export const register = async (req, res) => {
  const { email, name, password, phone, education, role } = req.body;

  if (!email || !name || !password || !phone || !education || !role) {
    return res.status(400).json({ message: "All the fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = new User({ email, name, password, phone, education, role });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
