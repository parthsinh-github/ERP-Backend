import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  examType: {
    type: String,
    enum: ['Midterm', 'Final', 'Unit Test', 'Practical'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true, // e.g. "09:00 AM"
  },
  endTime: {
    type: String,
    required: true,
  },
  department: {
  type: String,
  enum: [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Business Administration",
    "Commerce",
    "Arts",
    "Science",
    "Other"
  ],
  required: function () {
    return this.role === "student" || this.role === "faculty";
  }
},
  semester: {
  type: Number,
  enum: [1, 2, 3, 4, 5, 6],
  required: true,
},
  subject: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
