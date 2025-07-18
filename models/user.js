import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },

  // Shared between faculty and admin
  employeeId: { type: String, unique: true, sparse: true },

  // Student specific
  enrollmentNumber: { type: String, unique: true, sparse: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  department: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  address: { type: String },
  city: { type: String },
  pincode: { type: String },

  // Auth
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    required: true
  },

  // Meta
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    sparse: true,
    default: null
  },

  // New student academic info
  stream: {
    type: String,
    enum: ['BBA', 'BCA', 'BTECH', 'BCOM', 'MCA', 'MBA', 'OTHER'],
    required: function () {
      return this.role === 'student';
    }
  },
  batchYear: {
    type: Number,
    enum: [2023, 2024, 2025, 2026, 2027],
    required: function () {
      return this.role === 'student';
    }
  },
  currentYear: {
    type: Number,
    default: 1 // You can auto-increment this yearly using cron or backend job
  },
  division: {
    type: String, // e.g., 'Div-1'
    enum: ['Div-1', 'Div-2', 'Div-3', 'Div-4', 'Div-5'],
    required: function () {
      return this.role === 'student';
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
