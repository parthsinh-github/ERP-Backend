import express from 'express';
import multer from 'multer';
import BankDetails from '../models/BankDetails.js';

const router = express.Router();

// ✅ Use Multer to store files in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });



// ✅ Create or Update Bank Details (with optional files)
router.post(
  '/:id',
  upload.fields([
    { name: 'passbook', maxCount: 1 },
    { name: 'cheque', maxCount: 1 }
  ]),
  async (req, res) => {

    try {
      const userId = req.params.id; // ✅ Use the URL parameter
      const { bankName, accountNumber, ifsc, branch } = req.body;

      if (!userId) {
        console.warn('⚠️ [Validation Failed] userId missing');
        return res.status(400).json({ success: false, message: 'User ID is required' });
      }

      // ✅ Prepare update object
      const updateData = { bankName, accountNumber, ifsc, branch };

      // ✅ Add passbook file if uploaded
      if (req.files?.passbook?.[0]) {
        updateData.passbook = {
          data: req.files.passbook[0].buffer,
          contentType: req.files.passbook[0].mimetype
        };
      }

      // ✅ Add cheque file if uploaded
      if (req.files?.cheque?.[0]) {
        updateData.cheque = {
          data: req.files.cheque[0].buffer,
          contentType: req.files.cheque[0].mimetype
        };
      }


      // ✅ Save or Update BankDetails
      const bank = await BankDetails.findOneAndUpdate(
        { userId },
        updateData,
        { new: true, upsert: true }
      );


      res.status(200).json({ success: true, message: 'Bank details saved successfully', data: bank });
    } catch (err) {
      console.error('❌ [BankDetails Upload Error]', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);



// ✅ Fetch all Bank Details for a particular user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id; // ✅ Use :id from params

    const data = await BankDetails.find({ userId }); // ✅ Return all docs of this user

    if (!data || data.length === 0) {
      console.warn('⚠️ [No BankDetails Found]');
      return res.status(404).json({ success: false, message: 'No bank details found for this user' });
    }

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('❌ [Fetch BankDetails Error]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Fetch Passbook as File
// router.get('/:userId/passbook', async (req, res) => {
//   try {
//     const user = await BankDetails.findOne({ userId: req.params.userId });
//     if (!user?.passbook?.data) return res.status(404).send('Passbook not found');
//     res.contentType(user.passbook.contentType);
//     res.send(user.passbook.data);
//   } catch (err) {
//     res.status(500).send('Error fetching passbook');
//   }
// });

// // ✅ Fetch Cheque as File
// router.get('/:userId/cheque', async (req, res) => {
//   try {
//     const user = await BankDetails.findOne({ userId: req.params.userId });
//     if (!user?.cheque?.data) return res.status(404).send('Cheque not found');
//     res.contentType(user.cheque.contentType);
//     res.send(user.cheque.data);
//   } catch (err) {
//     res.status(500).send('Error fetching cheque');
//   }
// });

export default router;
