// config/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college_erp/documents', // Cloudinary folder
    resource_type: 'auto',           // Detect file type automatically
    format: async (req, file) => file.mimetype.split('/')[1], // dynamic format
    allowed_formats: ['jpg', 'png', 'pdf'],
       access_mode: 'public',  // ✅ ensures public access to uploaded files
  },
});

const upload = multer({ storage });
export default upload;
