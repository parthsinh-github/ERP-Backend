// routes/leaveRoutes.js
import express from 'express';
import {
  submitLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
  deleteLeaveRequest
} from '../controllers/leaveController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🧠 Middleware (optional): If using auth, import & use verifyToken etc.
// import { verifyToken } from '../middleware/auth.js'; // optional
// Add this to each route if auth is required: [verifyToken]

// 🔽 ROUTES

// Submit leave request - Only student will use this route
// POST /api/leaves/:id
router.post('/:id', submitLeaveRequest);

// Get leave requests - returns all if role is admin/faculty, otherwise returns own
// GET /api/leaves/:id
router.get('/:id', getAllLeaveRequests);

// Update leave status - for admin/faculty
// PATCH /api/leaves/:id
// routes/leaveRoutes.js (example)
router.patch('/:leaveId/:userId', updateLeaveStatus);


router.delete('/:id/:leaveId', deleteLeaveRequest);

export default router;
