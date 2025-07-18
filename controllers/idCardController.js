import { IDCard } from "../models/idCard.js";

// 1. Download ID Card
export const downloadIDCard = async (req, res) => {
  try {
    const { studentId } = req.body;

    let idCard = await IDCard.findOne({ student: studentId });

    if (!idCard) {
      idCard = await IDCard.create({
        student: studentId,
        hasDownloaded: true,
        downloadTimestamp: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: "ID Card generated and downloaded.",
        idCard,
      });
    }

    if (idCard.hasDownloaded && idCard.reDownloadRequest.status !== "Approved") {
      return res.status(403).json({
        success: false,
        message: "Already downloaded. Re-download requires admin approval.",
      });
    }

    idCard.hasDownloaded = true;
    idCard.downloadTimestamp = new Date();
    idCard.reDownloadRequest = {
      requested: false,
      reason: "",
      status: "Approved",
    };

    await idCard.save();

    return res.status(200).json({
      success: true,
      message: "Re-download successful.",
      idCard,
    });
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
};

// 2. Request Re-download
export const requestReDownload = async (req, res) => {
  try {
    const { studentId, reason } = req.body;

    const idCard = await IDCard.findOne({ student: studentId });

    if (!idCard || !idCard.hasDownloaded) {
      return res.status(400).json({
        success: false,
        message: "No previous download found. First download is allowed only.",
      });
    }

    if (idCard.reDownloadRequest?.status === "Pending") {
      return res.status(400).json({
        success: false,
        message: "Re-download request already pending.",
      });
    }

    idCard.reDownloadRequest = {
      requested: true,
      reason,
      status: "Pending",
      requestedAt: new Date(),
    };

    await idCard.save();

    res.status(200).json({
      success: true,
      message: "Re-download request submitted.",
    });
  } catch (error) {
    console.error("Request Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// 3. Admin Approval
export const reviewReDownload = async (req, res) => {
  try {
    const { studentId, status, adminId } = req.body;

    const idCard = await IDCard.findOne({ student: studentId });

    if (!idCard || !idCard.reDownloadRequest?.requested) {
      return res.status(404).json({
        success: false,
        message: "No re-download request found.",
      });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    idCard.reDownloadRequest.status = status;
    idCard.reDownloadRequest.admin = adminId;
    idCard.reDownloadRequest.reviewedAt = new Date();

    await idCard.save();

    res.status(200).json({
      success: true,
      message: `Re-download request ${status.toLowerCase()}.`,
    });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
// GET /api/idcard/all

export const getAllIdCards = async (req, res) => {
  try {
    const idCards = await IDCard.find().populate('student'); // ✅ crucial
    res.status(200).json({ data: idCards });
  } catch (err) {
    console.error("❌ Error in getAllIdCards:", err);
    res.status(500).json({ error: 'Failed to fetch ID cards' });
  }
};