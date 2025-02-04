const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://192.168.1.230:8081', // Replace with your frontend's Expo development server URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const businessRoutes = require('./routes/businessRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/businesses', businessRoutes);

// Test Route
app.get('/', (req, res) => res.send('AutoBodyApp Backend is running!'));

// Start Server
app.listen(port, '0.0.0.0', () => console.log(`Server running on http://192.168.1.230:${port}`));

// Error handling for uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});