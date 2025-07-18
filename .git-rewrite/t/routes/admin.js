import express from "express";
import { registerAdmin, loginAdmin, logoutAdmin } from "../controllers/admin.js";

const router = express.Router();

// 🟢 Register Admin
router.post("/register", registerAdmin);

// 🟢 Login Admin
router.post("/login", loginAdmin);

// 🟢 Logout Admin
router.post("/logout", logoutAdmin);

export default router;
