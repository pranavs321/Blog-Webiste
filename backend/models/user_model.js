import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: { type: Number, required: true, unique: true },
    education: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    token: { type: String },
  },
  { timestamps: true }
);

// 🔒 hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 compare password method
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

const User = mongoose.model("User", userSchema);
export default User;
