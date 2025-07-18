import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expires: { type: Date, required: true },
      attempts: { type: Number, default: 0 }  // ✅ Add this
  },
  { timestamps: true }
);

// Auto-delete expired OTPs
OtpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;
