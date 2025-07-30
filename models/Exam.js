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
 stream: { 
     type: String,
    enum: ['BBA', 'BCA', 'BTECH', 'BCOM', 'MCA', 'MBA', 'OTHER'],
     required: true,
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
