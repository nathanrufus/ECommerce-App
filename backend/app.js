// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth'); // Add more routes as you build

const app = express();

// Global Middlewares
app.use(helmet());              // Security headers
app.use(cors());                // Enable CORS
app.use(morgan('dev'));         // HTTP request logger
app.use(express.json());        // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);

// Health check (optional)
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running ✅' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
