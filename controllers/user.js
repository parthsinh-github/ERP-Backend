import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.js";
import Otp from "../models/Otp.js"; // your existing model (required)
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js"; // 

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sanitizeUser = (user) => {
  const { password, __v, ...rest } = user.toObject();
  return rest;
};

// ===================== REGISTER WITH OTP VERIFICATION ===================== //

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      department,
      address,
      city,
      pincode,
      enrollmentNumber,
      employeeId,
      gender,
      dateOfBirth,
      role,
      secretKey,
      otp,

      // New fields
      stream,
      batchYear,
      currentYear,
      division,
    } = req.body;

    if (role === "faculty" && secretKey !== process.env.FACULTY_SECRET_KEY) {
      return res.status(401).json({ success: false, message: "Invalid faculty secret key" });
    }

    if (role === "admin" && secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: "Invalid admin secret key" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (otpRecord.expires < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otpRecord.attempts >= 3) {
      return res.status(429).json({ success: false, message: "Too many incorrect attempts. Please request a new OTP." });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      department,
      address,
      city,
      pincode,
      gender,
      dateOfBirth,
      enrollmentNumber,
      employeeId,
      stream,
      batchYear,
      currentYear: currentYear || 1,
      division,
    });

    await user.save();

    await Otp.deleteOne({ email });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===================== LOGIN ===================== //
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===================== LOGOUT ===================== //
export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Update profile info
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};
// @desc    Reset password after OTP verification
export const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (otpRecord.expires < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otpRecord.attempts >= 3) {
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await Otp.deleteOne({ email });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};



// ===================== GET ALL USERS ===================== //
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ===================== SEND OTP ===================== //
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Remove any existing OTP for this email
    await Otp.findOneAndDelete({ email });

    // Save new OTP
    await Otp.create({ email, otp: otpCode, expires });

    // Send OTP via email
    await sendEmail(
      email,
      "Your OTP for College ERP",
      `Your One-Time Password is: ${otpCode}\nIt is valid for 10 minutes.`
    );

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// ===================== VERIFY OTP ===================== //
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (otpRecord.expires < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
