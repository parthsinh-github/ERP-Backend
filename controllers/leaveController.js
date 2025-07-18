// controllers/leaveController.js
import LeaveRequest from '../models/leaveRequest.js';
// import User from '../models/user.js'; // assuming roles are stored here
import {User} from '../models/user.js'; // assuming roles are stored here

// POST: /api/leaves/:id
export const submitLeaveRequest = async (req, res) => {
  const { id } = req.params;

  const {
    studentName,
    studentId,
    department,
    fromDate,
    toDate,
    reason,
  } = req.body;

  try {
    const newLeave = new LeaveRequest({
      studentName,
      studentId,
      department,
      fromDate,
      toDate,
      reason,
      createdBy: id,
    });

    const saved = await newLeave.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET: /api/leaves/:id
export const getAllLeaveRequests = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id); // Get user role based on ID

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    let leaves;

    if (user.role === 'admin' || user.role === 'faculty') {
      // Admins or Faculty get all leave requests
      leaves = await LeaveRequest.find().sort({ createdAt: -1 });
    } else {
      // Students get only their own
      leaves = await LeaveRequest.find({ createdBy: id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// PATCH: /api/leaves/:id
// PATCH /api/leaves/:leaveId/:userId
export const updateLeaveStatus = async (req, res) => {
  const { leaveId, userId } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    const user = await User.findById(userId);
    if (!user || !['admin', 'faculty'].includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Not authorized to perform this action' });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(
      leaveId,
      {
        status,
        updatedBy: userId,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




export const deleteLeaveRequest = async (req, res) => {
  const { id, leaveId } = req.params;

  try {
    // Step 1: Get the user who is trying to delete the leave
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Step 2: Get the leave request
    const leave = await LeaveRequest.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    // Step 3: Role-based deletion logic
    const allowedRoles = ['admin', 'faculty'];

    if (
      allowedRoles.includes(user.role) ||
      leave.createdBy.toString() === id // student trying to delete their own leave
    ) {
      await LeaveRequest.findByIdAndDelete(leaveId);
      return res.json({ success: true, message: 'Leave request deleted successfully' });
    } else {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this leave' });
    }

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
