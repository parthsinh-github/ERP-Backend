import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/user.js";
// import { protect } from "../middleware/auth.js";
// import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// ✅ OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);


router.post("/reset-password", resetPassword);

// ✅ Admin-only route
router.get("/all", getAllUsers);

export default router;
