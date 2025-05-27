// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const metaRoutes = require('./routes/adminMetaRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewWishlistRoutes = require('./routes/reviewWishlistRoutes');
const searchRoutes = require('./routes/searchRoutes');





const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Static file serving (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', metaRoutes);
app.use('/api', orderRoutes);
app.use('/api', reviewWishlistRoutes);
app.use('/api', searchRoutes);


// Root route
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API running ✅' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
