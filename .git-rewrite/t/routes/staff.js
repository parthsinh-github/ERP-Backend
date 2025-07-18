import express from "express";
import { registerStaff, loginStaff, logoutStaff } from "../controllers/staff.js";

const router = express.Router();

// 🟢 Register Staff
router.post("/register", registerStaff);

// 🟢 Login Staff
router.post("/login", loginStaff);

// 🟢 Logout Staff
router.post("/logout", logoutStaff);

export default router;
