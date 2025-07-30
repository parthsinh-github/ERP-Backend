import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: String,
  accountNumber: String,
  ifsc: String,
  branch: String,

  // ✅ Store file securely as binary
  passbook: {
    data: Buffer,
    contentType: String
  },
  cheque: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true });

const BankDetails = mongoose.models.BankDetails || mongoose.model('BankDetails', bankSchema);

export default BankDetails;
