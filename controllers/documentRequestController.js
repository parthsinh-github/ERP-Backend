import { User } from '../models/user.js';
import DocumentRequest from '../models/DocumentRequest.js';

export const createRequest = async (req, res) => {
  const { studentId } = req.params; // 👈 Get student ID from URL param
  const { documentType, reason } = req.body;

  try {
    // 🔐 Check if studentId exists and is a student
    const studentUser = await User.findById(studentId);

    if (!studentUser || studentUser.role !== 'student') {
      return res.status(403).json({
        success: false,
        error: 'Only students are allowed to create document requests.',
      });
    }

    // ✅ Create the document request
    const newRequest = await DocumentRequest.create({
      student: studentId,
      documentType,
      reason,
      logs: [{ message: 'Request created by student' }],
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    console.error('Error creating document request:', err);
    res.status(500).json({ success: false, error: 'Failed to create request' });
  }
};


export const getAllRequestsForAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Base query
    let query = user.role === 'admin' || user.role === 'faculty'
      ? {} // Admins/faculty get all requests
      : { student: id }; // Others get only their own

    // Fetch document requests with full student info, excluding password
    const requests = await DocumentRequest.find(query)
      .populate('student', '-password -__v')
      .sort({ requestedAt: -1 });

    res.status(200).json({ success: true, data: requests });

  } catch (err) {
    console.error('Error fetching document requests:', err);
    res.status(500).json({ success: false, error: 'Error fetching requests' });
  }
};



export const updateRequestStatus = async (req, res) => {
  const { adminId, documentRequestId } = req.params;
  const { status, logMessage } = req.body;

  try {
    // ✅ Step 1: Verify admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized: Only admin can update requests' });
    }

    // ✅ Step 2: Find document request
    const request = await DocumentRequest.findById(documentRequestId);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Document request not found' });
    }

    // ✅ Step 3: Update status and optionally log message
    request.status = status;
    if (logMessage) {
      request.logs.push({ message: `Admin update: ${logMessage}` });
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: request,
    });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ success: false, error: 'Server error while updating request' });
  }
};
