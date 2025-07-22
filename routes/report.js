import express from "express";
import { createReport, getAllReports } from "../controllers/report.js";

const router = express.Router();

router.post("/:creatorId/:studentId", createReport);// Create a new report

router.get("/:userId", getAllReports);          // Get all reports

export default router;
