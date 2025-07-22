import express from 'express';
import {
  createRequest,
  getAllRequestsForAdmin,
  updateRequestStatus
} from '../controllers/documentRequestController.js';

const router = express.Router();

// Student creates a request
// POST /api/v1/requests/:studentId
router.post('/:studentId', createRequest);

// Admin gets all requests
// GET /api/v1/requests/admin/:adminId
router.get('/:id', getAllRequestsForAdmin);

// routes/documentRequestRoutes.js
router.put('/:adminId/:documentRequestId', updateRequestStatus);

export default router;
