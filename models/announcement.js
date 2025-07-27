import mongoose from 'mongoose';

// Define the schema for announcements
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },  
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  batchYear: {
    type: Number,
    enum: [2023, 2024, 2025, 2026, 2027],
   },     // e.g., 2023
  stream: { 
     type: String,
    enum: ['BBA', 'BCA', 'BTECH', 'BCOM', 'MCA', 'MBA', 'OTHER'],

    },   
  division: { type: String, 
 enum: ['Div-1', 'Div-2', 'Div-3', 'Div-4', 'Div-5'],
    
   },      
});

// Check if the model has already been defined to avoid overwriting it
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

// Export the model using ES6 syntax
export default Announcement;
