import express from "express";
import { registerStudent, loginStudent, logoutStudent , getAllStudents} from "../controllers/student.js";

const router = express.Router();

// Register a new student
router.post("/register", registerStudent);

// Student Login
router.post("/login", loginStudent);

// Student Logout
router.post("/logout", logoutStudent);

router.get("/all", getAllStudents);

export default router;
