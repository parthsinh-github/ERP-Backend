import express from "express";
import { createReport, getAllReports } from "../controllers/report.js";

const router = express.Router();

router.post("/:adminId/create", createReport);   // Create a new report

router.get("/all", getAllReports);          // Get all reports

export default router;
