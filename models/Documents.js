// models/Documents.js
import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['10th_marksheet', '12th_marksheet', 'LC', 'CasteCertificate', 'Other'],
    required: true
  },
  fileUrl: { type: String, required: true },
}, { timestamps: true });

const Documents = mongoose.models.Documents || mongoose.model('Documents', docSchema);

export default Documents;