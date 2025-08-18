import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/database.js';
import rateLimiter from './src/middleware/rateLimiter.js';
import deviceCleanupJob from './src/jobs/deviceCleanup.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import deviceRoutes from './src/routes/devices.js';
import analyticsRoutes from './src/routes/analytics.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter); // Note: Applying this globally might rate-limit your health check. You might consider applying it only to specific routes.

// Routes
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/analytics', analyticsRoutes); 

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start background jobs
deviceCleanupJob();

// Centralized Error Handling Middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;