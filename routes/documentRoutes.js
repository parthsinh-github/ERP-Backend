// routes/documentRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import Documents from '../models/Documents.js';

const router = express.Router();

// ✅ Upload a document
router.post('/upload', upload.single('file'), async (req, res, next) => {
  console.log('🔹 [DEBUG] Hit /upload endpoint');

  try {
    console.log('🔹 [DEBUG] req.body:', req.body);
    console.log('🔹 [DEBUG] req.file:', req.file);

    const { userId, type } = req.body;

    if (!req.file) {
      console.error('❌ [ERROR] No file uploaded');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('❌ [ERROR] Invalid userId:', userId);
      return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
    }

    const newDoc = new Documents({
      userId,
      type,
      fileUrl: req.file.path,
    });

    console.log('🔹 [DEBUG] Saving document to DB:', newDoc);

    await newDoc.save();

    console.log('✅ [DEBUG] Document saved successfully');
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: newDoc
    });

  } catch (error) {
    console.error('❌ [CATCHED ERROR]', error);
    next(error); // pass to global error handler
  }
});


export default router;

// ✅ Fetch all documents for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const docs = await Documents.find({ userId });
    return res.status(200).json({ success: true, data: docs });

  } catch (error) {
    console.error('❌ [FETCH ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Fetch single document by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await Documents.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('❌ [FETCH ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
