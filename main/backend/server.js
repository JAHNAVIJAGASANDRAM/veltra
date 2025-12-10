import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from "./config/db.js";

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import teamRoutes from './routes/teams.js';
import contentRoutes from './routes/content.js';
import taskRoutes from './routes/tasks.js';
import analyticsRoutes from './routes/analytics.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/teams', authenticateToken, teamRoutes);
app.use('/api/content', authenticateToken, contentRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Veltra API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Veltra Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch(console.error);

export default app;