import express from "express";
import { registerUser, loginUser, logoutUser ,getAllUsers} from "../controllers/user.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { verifyOtp } from "../controllers/verifyOtp.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Example protected route
router.get("/me", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.post("/verify-otp", verifyOtp); // 👈 new


router.get("/logout", logoutUser); // 👈 add this line

// Example role-protected route
router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});


router.get("/all",   getAllUsers); // JWT verification middleware

export default router;
