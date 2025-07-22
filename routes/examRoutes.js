import express from 'express';
import { createExam, getAllExams, getExamById, deleteExam } from '../controllers/examController.js';

const router = express.Router();

// POST /api/v1/exams - Create exam
router.post('/:id', createExam);

// GET /api/v1/exams - Get all exams
router.get('/allExam', getAllExams);

// GET /api/v1/exams/:id - Get specific exam
router.get('/:id', getExamById);

// DELETE /api/v1/exams/:id - Delete exam
router.delete('/:id', deleteExam);

export default router;
