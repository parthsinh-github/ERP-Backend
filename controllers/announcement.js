import Announcement from '../models/announcement.js';
import { User } from '../models/user.js';

export const createAnnouncement = async (req, res) => {
  const { id } = req.params; // userId (admin or faculty)
  const { title, description, date, batchYear, currentYear, division, stream } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID (creator) is required in URL params" });
  }

  try {
    // Fetch the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check role
    if (user.role !== 'admin' && user.role !== 'faculty') {
      return res.status(403).json({ message: "Only admin or faculty can create announcements" });
    }

    // ✅ Create new announcement
    const newAnnouncement = new Announcement({
      title,
      description,
      date,
      createdBy: id,
      batchYear,
      currentYear,
      division,
      stream,
    });

    await newAnnouncement.save();

    res.status(201).json({
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating announcement", error: error.message });
  }
};


// 🔄 GET: All Announcements filtered by Student's batch, year, stream
// 🔄 GET: All Announcements filtered by Student's batch, year, stream


export const getAllAnnouncements = async (req, res) => {
  try {
     const student = await User.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { batchYear, division, department } = student;
    const announcements = await Announcement.find({
      $or: [
        // Global announcements (no filters set)
        {
          batchYear: { $exists: false },
          division: { $exists: false },
          department: { $exists: false }
        },
        // Batch year match only
        {
          batchYear,
          division: { $exists: false },
          department: { $exists: false }
        },
        // Division match only
        {
          division,
          batchYear: { $exists: false },
          department: { $exists: false }
        },
        // Department match only (optional if you add department later)
        {
          department,
          batchYear: { $exists: false },
          division: { $exists: false }
        },
        // Batch + Division
        {
          batchYear,
          division
        },
        // Batch + Department
        {
          batchYear,
          department
        },
        // Division + Department
        {
          division,
          department
        },
        // Batch + Division + Department
        {
          batchYear,
          division,
          department
        }
      ]
    }).sort({ date: -1 });

    res.status(200).json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Server error' });
  }
};






// 🔄 GET: Single Announcement by ID (unchanged)
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving announcement", error: error.message });
  }
};


// Update an announcement
export const updateAnnouncement = async (req, res) => {
    try {
        const { title, description, date } = req.body;

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { title, description, date },
            { new: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ message: "Error updating announcement", error: error.message });
    }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting announcement", error: error.message });
    }
};
