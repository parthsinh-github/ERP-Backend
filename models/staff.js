import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "staff" }
}, { timestamps: true });

export const Staff = mongoose.model("Staff", staffSchema);
