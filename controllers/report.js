import { Report } from "../models/report.js";
import { User } from "../models/user.js";

export const createReport = async (req, res) => {
  try {
    const { creatorId, studentId } = req.params;
    const { type, title, description, status, dateIssued } = req.body;

    if (!creatorId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "creatorId and studentId are required in the URL.",
      });
    }

    // Validate creator
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Validate student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Create and save the report
    const report = new Report({
      createdBy: creatorId,
      studentId,
      type,
      title,
      description,
      status: status || "Pending",
      dateIssued: dateIssued || Date.now(),
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAllReports = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in the URL.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let reports;

    if (user.role === "student") {
      // Student can see only reports about them
      reports = await Report.find({ studentId: userId })
        .populate("createdBy", "fullName email role")
        .populate("studentId", "fullName email role")
        .sort({ createdAt: -1 });
    } else if (user.role === "admin" || user.role === "faculty") {
      // Admins or faculty can see all reports
      reports = await Report.find()
        .populate("createdBy", "fullName email role")
        .populate("studentId", "fullName email role")
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

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
