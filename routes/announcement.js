import express from 'express';
import { 
    createAnnouncement, 
    getAllAnnouncements, 
    getAnnouncementById, 
    updateAnnouncement, 
    deleteAnnouncement 
} from '../controllers/announcement.js'; // Correct import

const router = express.Router();

// Create a new announcement (Protected)
router.post('/:id', createAnnouncement);


// Get all announcements
router.get('/allAnnouncements', getAllAnnouncements);

// Get a single announcement by ID
router.get('/:id', getAnnouncementById);

// Update an announcement (Protected)
router.put('/:id',  updateAnnouncement);

// Delete an announcement (Protected)
router.delete('/:id',  deleteAnnouncement);

export default router;
