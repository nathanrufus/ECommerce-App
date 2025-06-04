require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category'); // Adjust path if needed

const categories = [
  { name: 'Laptops', slug: 'laptops' },
  { name: 'CPUs', slug: 'cpus' },
  { name: 'Mouse', slug: 'mouse' },
  { name: 'Phone', slug: 'phone' },
  { name: 'iPhone', slug: 'iphone' },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Optionally clear existing
    await Category.deleteMany({});
    console.log('🗑️ Cleared old categories');

    const withTimestamps = categories.map(cat => ({
      ...cat,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Category.insertMany(withTimestamps);
    console.log('🚀 Seeded categories successfully');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedCategories();
