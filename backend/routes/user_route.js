import express from "express";
import { login, logout, myProfile, register } from "../controller/user_controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);

export default router;
