import { Report } from "../models/report.js";
import { User } from "../models/user.js"; // ✅ named export from your user model

export const createReport = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { studentId, type, title, description, status, dateIssued } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required in the URL.",
      });
    }

    // Check if this user exists and is an admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only valid admins can create reports.",
      });
    }

    const report = new Report({
      studentId,
      adminId,
      type,
      title,
      description,
      status: status || "Pending",
      dateIssued: dateIssued || new Date(),
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("studentId", "fullName enrollmentNumber role")
      .populate("adminId", "fullName email role");

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Fetch reports error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};