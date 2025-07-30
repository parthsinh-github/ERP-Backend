// routes/academicDetails.js
import express from 'express';
import upload from '../config/multer.js';  // ✅ uses Cloudinary storage
import AcademicDetails from '../models/AcademicDetails.js';  // ✅ Corrected import
import {User} from '../models/user.js';

const router = express.Router();
/**
 * ✅ Upload all academic documents and save URLs to MongoDB (userId from params)
 */
router.post(
  '/:id',   // ✅ renamed userId → id
  upload.fields([
    { name: 'tenthMarksheet', maxCount: 1 },
    { name: 'twelfthMarksheet', maxCount: 1 },
    { name: 'lc', maxCount: 1 },
    { name: 'casteCertificate', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'migrationCertificate', maxCount: 1 }
  ]),
  async (req, res) => {

    try {
      const { id } = req.params; // ✅ now matches frontend
      if (!id) {
        return res.status(400).json({ success: false, message: 'User ID is required in params' });
      }

      // ✅ Verify user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // ✅ Check role
      if (user.role !== 'student') {
        return res.status(403).json({ success: false, message: 'Only students can upload academic documents' });
      }

      // ✅ Map uploaded file URLs
      const fileUrls = {};
      for (const field in req.files) {
        fileUrls[field] = req.files[field][0].path;
      }

      // ✅ Save or update academic details
      const savedDocs = await AcademicDetails.findOneAndUpdate(
        { userId: id },
        fileUrls,
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'Academic documents uploaded successfully',
        data: savedDocs
      });
    } catch (err) {
      console.error('❌ Academic Upload Error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);




/**
 * ✅ Fetch all documents for a specific user
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user; // ✅ extracted from token by middleware


    // ✅ Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ If requester is student, ensure they can only fetch their own docs
    // if (requester.role === 'student' && requester.id !== id) {
    //   return res.status(403).json({ success: false, message: 'Access denied' });
    // }

    // ✅ Fetch academic documents
    const docs = await AcademicDetails.find({ userId: id });
    if (!docs.length) {
      return res.status(404).json({ success: false, message: 'No academic details found' });
    }

    res.status(200).json({ success: true, data: docs });

  } catch (err) {
    console.error('❌ [Fetch AcademicDetails Error]', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

export default router;