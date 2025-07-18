import express from "express";
import { registerFaculty, loginFaculty, logoutFaculty } from "../controllers/faculty.js";

const router = express.Router();

// 🟢 Register Faculty
router.post("/register", registerFaculty);

// 🟢 Login Faculty
router.post("/login", loginFaculty);

// 🟢 Logout Faculty
router.post("/logout", logoutFaculty);

export default router;
