import mongoose from "mongoose";

const idCardSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
  },
  hasDownloaded: {
    type: Boolean,
    default: false,
  },
  downloadTimestamp: {
    type: Date,
  },
  reDownloadRequest: {
    requested: { type: Boolean, default: false },
    reason: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    requestedAt: { type: Date },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: { type: Date }
  },
  photoURL: {
    type: String,
  },
}, { timestamps: true });

export const IDCard = mongoose.model("IDCard", idCardSchema);
