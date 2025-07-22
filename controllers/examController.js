import Exam from '../models/Exam.js';
import {User} from '../models/user.js';

// Create Exam
export const createExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists and has permission
    const user = await User.findById(id);
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admin or faculty can create exams.',
      });
    }

    // Attach creator to exam
    const examData = {
      ...req.body,
      createdBy: id, // Set the creator ID
    };

    const exam = await Exam.create(examData);

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });

  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exam. Please try again later.',
    });
  }
};




// Get All Examsimport Exam from '../models/Exam.js'; // adjust path as needed

// @desc    Get all exams
// @route   GET /api/v1/exam/all
// @access  Public or Protected (add auth if needed)
export const getAllExams = async (req, res) => {
  try {
    // Fetch all exams and populate creator's full name & email
    const exams = await Exam.find()
      .populate('createdBy', 'fullName email') // make sure your User model has 'fullName'

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
