import express from "express";
import {
  downloadIDCard,
  requestReDownload,
  reviewReDownload,
  getAllIdCards
} from "../controllers/idCardController.js";

const router = express.Router();

// Body: { studentId }
router.post("/:studentId", downloadIDCard);

// Body: { studentId, reason }
router.post("/request-redownload", requestReDownload);

// Body: { studentId, status, adminId }
router.post("/review-request", reviewReDownload);


router.get("/all/:id", getAllIdCards);

export default router;
