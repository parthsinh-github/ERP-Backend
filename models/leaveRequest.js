// models/LeaveRequest.js
import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Connects to all user info
    // required: true,
  },
  studentId: {
    type: String,
    // required: true,
  },
  department: {
    type: String,
    // required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Student'/'Faculty'/'Admin' as per your auth system
    required: true,
   },
   updatedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LeaveRequest', leaveRequestSchema);
