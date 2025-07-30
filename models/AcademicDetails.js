// models/AcademicDetails.js
import mongoose from 'mongoose';

const academicDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  tenthMarksheet: { type: String, required: true },          // file URL
  twelfthMarksheet: { type: String, required: true },        // file URL
  lc: { type: String, required: true },                      // file URL
  casteCertificate: { type: String, required: true },        // file URL
  aadhar: { type: String, required: true },                  // file URL
  birthCertificate: { type: String, required: true },        // file URL
  photo: { type: String, required: true },                   // file URL
  migrationCertificate: { type: String, required: true },    // file URL
}, { timestamps: true });

const AcademicDetails = mongoose.models.AcademicDetails || mongoose.model('AcademicDetails', academicDetailsSchema);

export default AcademicDetails;
