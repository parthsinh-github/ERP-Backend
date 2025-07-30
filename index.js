import express from 'express'; 
import { connectDB } from './utils/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

// Routes
import userRoutes from "./routes/user.js";
import announcementRoutes from "./routes/announcement.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import examRoutes from './routes/examRoutes.js';
import reportRoutes from './routes/report.js';
import idCardRoutes from './routes/idCardRoutes.js';
import documentRoutes from './routes/documentRequestRoutes.js';
import documentRoute   from './routes/documentRoutes.js';
import bankDetailsRoutes from './routes/bankDetailsRoutes.js';
import academicDetailsRoutes from './routes/academicDetailsRoutes.js';


// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

/// ✅ CORS Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://college-erp-tech.netlify.app'],
  credentials: true,
}));

// ✅ Preflight Handling (for older browsers)
app.options('*', cors());

// ✅ Dynamic CORS Header Fallback (important!)
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://college-erp-tech.netlify.app'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // ✅ Important line
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/announcement", announcementRoutes);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/v1/exam", examRoutes);
app.use("/api/v1/report", reportRoutes);
app.use("/api/v1/id-card", idCardRoutes);
app.use("/api/v1/document", documentRoutes);
app.use("/api/v1/upload/document", documentRoute);
app.use('/api/v1/bank', bankDetailsRoutes);
app.use('/api/v1/academic', academicDetailsRoutes);


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
});