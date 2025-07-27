import { IDCard } from "../models/idCard.js";
import { User } from '../models/user.js';
   // Assuming you're already importing this

export const downloadIDCard = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required in the URL.",
      });
    }

    // ✅ Check if student exists
    const studentExists = await User.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    let idCard = await IDCard.findOne({ student: studentId });

    const MAX_DOWNLOADS = 3;

    // First time download – create record
    if (!idCard) {
      idCard = await IDCard.create({
        student: studentId,
        hasDownloaded: true,
        downloadTimestamp: new Date(),
        downloadCount: 1,
        reDownloadRequest: {
          requested: false,
          reason: "",
          status: "Approved",
          count: 0,
        },
      });

      return res.status(200).json({
        success: true,
        message: "ID Card downloaded successfully (1st time).",
        downloadCount: 1,
        idCard,
      });
    }

    // Check if download limit reached
    if (idCard.downloadCount >= MAX_DOWNLOADS) {
      return res.status(403).json({
        success: false,
        message:
          "You have reached the maximum download limit (3 times). Please contact your counselor or admin for further access.",
      });
    }

    // Allow download and increment count
    idCard.hasDownloaded = true;
    idCard.downloadTimestamp = new Date();
    idCard.downloadCount += 1;
    idCard.reDownloadRequest = {
      requested: false,
      reason: "",
      status: "Approved",
      count: (idCard.reDownloadRequest.count || 0) + 1,
    };

    await idCard.save();

    return res.status(200).json({
      success: true,
      message: "ID Card downloaded successfully.",
      downloadCount: idCard.downloadCount,
      idCard,
    });
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Student ID is required in the URL." });
    }

    // ✅ Find the requesting user
    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const role = student.role || "student" ;

   

    if (role === "student" || role === "faculty"||role === "admin") {
      // ✅ Student should see only their own logs
      const idCards = await IDCard.find({ student: id }).populate("student");
if (!idCards || idCards.length === 0) {
  return res.status(200).json({ data: [] }); // ✅ Consistent response
}


      // ✅ Return only the student's own records
      return res.status(200).json({ data: idCards });
    }

    // ❌ Any other role is not authorized
    return res.status(403).json({ error: "Unauthorized role." });

  } catch (err) {
    console.error("❌ Error in getAllIdCards:", err);
    res.status(500).json({ error: "Failed to fetch ID cards." });
  }
};
