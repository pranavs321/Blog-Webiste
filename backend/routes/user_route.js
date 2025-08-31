import express from "express";
import { login, logout,register,myProfile,getAdmins} from "../controller/user_controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, myProfile);
router.get("/admins",isAuthenticated,getAdmins)
export default router;
