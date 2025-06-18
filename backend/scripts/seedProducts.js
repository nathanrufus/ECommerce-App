require('dotenv').config();
const mongoose = require('mongoose');
const { scrapeSarukCategory } = require('./scrapeSaruk');

// Replace with your real model import
const Product = require('../models/product');

const CATEGORIES = [
  { name: 'Laptops', url: 'https://saruk.co.ke/category/Laptops/1' },
  { name: 'Laptop batteries', url: 'https://saruk.co.ke/category/Laptop-Batteries/1' },
  { name: 'Laptop chargers', url: 'https://saruk.co.ke/category/Laptop-Chargers/1' },
  { name: 'Laptop keyboard', url: 'https://saruk.co.ke/category/Keyboards/1' },
  { name: 'Laptop rams', url: 'https://saruk.co.ke/category/Laptop-RAM/1' },
  { name: 'Laptop ssd', url: 'https://saruk.co.ke/category/Solid-State-Drives-SSD/1' },
  { name: 'Laptop hardisk', url: 'https://saruk.co.ke/category/Internal-Hard-Drives/1' },
  { name: 'CPUs', url: 'https://saruk.co.ke/category/Processors/1' },
  { name: 'Monitor', url: 'https://saruk.co.ke/category/Monitors/1' },
  { name: 'Mouse', url: 'https://saruk.co.ke/category/Mouse/1' },
  { name: 'Flash disk', url: 'https://saruk.co.ke/category/Flash-Drives/1' },
  { name: 'Memory Card', url: 'https://saruk.co.ke/category/Memory-Cards/1' },
  { name: 'Phone', url: 'https://saruk.co.ke/category/Phones/1' },
  { name: 'Samsung', url: 'https://saruk.co.ke/category/Samsung-Phones/1' },
  { name: 'iPhone', url: 'https://saruk.co.ke/category/Apple-iPhones/1' },
  { name: 'Redmi', url: 'https://saruk.co.ke/category/Xiaomi-Phones/1' },
  { name: 'Phone chargers', url: 'https://saruk.co.ke/category/Chargers/1' },
  { name: 'Phone cables', url: 'https://saruk.co.ke/category/Cables/1' },
  { name: 'All in one monitors', url: 'https://saruk.co.ke/category/All-In-One-PCs/1' },
  { name: 'Mifi', url: 'https://saruk.co.ke/category/Mifi/1' },
  { name: 'Kids tables', url: 'https://saruk.co.ke/category/Kids-Tablets/1' },
  { name: 'Samsung tablets', url: 'https://saruk.co.ke/category/Samsung-Tablets/1' },
  { name: 'Brand new laptops', url: 'https://saruk.co.ke/category/Brand-New-Laptops/1' }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const cat of CATEGORIES) {
      console.log(`🔍 Scraping: ${cat.name}`);
      const products = await scrapeSarukCategory(cat.url, 10);

      if (products.length === 0) {
        console.warn(`⚠️ No products found for ${cat.name}`);
        continue;
      }

      await Product.insertMany(products);
      console.log(`✅ Inserted ${products.length} products for ${cat.name}`);
    }

    console.log('🎉 Seeding complete');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    mongoose.disconnect();
  }
};

seedProducts();
