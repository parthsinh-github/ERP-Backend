import mongoose from 'mongoose';

// Define the schema for announcements
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },  
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
});

// Check if the model has already been defined to avoid overwriting it
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

// Export the model using ES6 syntax
export default Announcement;
