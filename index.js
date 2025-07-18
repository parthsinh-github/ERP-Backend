import express from 'express'; 
import { connectDB } from './utils/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import userRoutes from "./routes/user.js";
import announcementRoutes from "./routes/announcement.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import examRoutes from './routes/examRoutes.js';
import reportRoutes from './routes/report.js';
import idCardRoutes from './routes/idCardRoutes.js';
import documentRoutes from './routes/documentRequestRoutes.js';

// Config
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// ✅ CORS Setup (Netlify only)
app.use(cors({
  origin: ['https://college-erp-tech.netlify.app'],
  credentials: true,
}));

// ✅ Preflight Handling (OPTIONS)
app.options('*', cors());

// ✅ Optional fallback CORS headers (helps with stubborn hosting issues)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://college-erp-tech.netlify.app");
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

// Serve frontend (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

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
