import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    department: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    role: { type: String, default: "student" }
}, { timestamps: true });

export const Student = mongoose.model("Student", studentSchema);
