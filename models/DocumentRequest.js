import mongoose from 'mongoose';

const documentRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User/Student model
    required: true,
  },

  documentType: {
    type: String,
    enum: [
      'Bonafide',
      'Character Certificate',
      'Leaving Certificate',
      'Marksheets',
      'Caste Certificate',
      'Transfer Certificate',
      'Fee Structure',
      'Migration Certificate',
      'Scholarship Letter'
    ],
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
    // required: true,
    match: /^[6-9]\d{9}$/, // Indian mobile format validation
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  deliveryMode: {
    type: String,
    enum: ['physical', 'email', 'both'],
    default: 'physical',
  },

  deliveryEmail: {
    type: String,
  },

  expectedNeedDate: {
    type: Date,
    required: false, // Optional field in case student has a deadline
  },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or 'Student'/'Faculty'/'Admin' as per your auth system
      // required: true,
     },
     updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  requestedAt: {
    type: Date,
    default: Date.now,
  },

  returnBy: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setDate(now.getDate() + 7); // 7-day return period
      return now;
    },
  },

  logs: [
    {
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const DocumentRequest = mongoose.models.DocumentRequest || mongoose.model('DocumentRequest', documentRequestSchema);

export default DocumentRequest;
