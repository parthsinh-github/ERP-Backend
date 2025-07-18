import Exam from "../models/Exam.js";

// Create Exam
export const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, message: 'Exam created successfully', data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Examsimport Exam from '../models/Exam.js'; // adjust path as needed

// @desc    Get all exams
// @route   GET /api/v1/exam/all
// @access  Public or Protected (add auth if needed)
export const getAllExams = async (req, res) => {
  try {
    // Fetch all exams and populate creator info (name & email)
    const exams = await Exam.find().populate('createdBy', 'name email');

    // Return success response
    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams. Please try again later.',
    });
  }
};

// Get Exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Exam
export const deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
