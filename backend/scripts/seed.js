require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const ProductTag = require('../models/producttag');
const MediaFile = require('../models/mediafile');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // make sure it's the correct path


const MONGO_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🔌 Connected to DB');

    // 1. Categories
    const categories = [
      'Laptops', 'Laptop Batteries', 'Laptop Chargers', 'CPUs',
      'Mouse', 'Phone', 'iPhone', 'Samsung Tablets'
    ];

    const categoryDocs = await Category.insertMany(categories.map(name => ({
      name,
      slug: faker.helpers.slugify(name.toLowerCase())
    })));

    // 2. Brands
    const brandDocs = await Brand.insertMany(['Dell', 'HP', 'Apple', 'Lenovo', 'Samsung'].map(name => ({
      name,
      slug: faker.helpers.slugify(name.toLowerCase())
    })));

    // 3. Tags
    const tagDocs = await ProductTag.insertMany(['New', 'Popular', 'Best Seller'].map(name => ({
      name,
      slug: faker.helpers.slugify(name.toLowerCase())
    })));
    // 5. Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10); // change password if needed

    const adminExists = await User.findOne({ email: 'admin@kwalas.com' });

    if (!adminExists) {
    await User.create({
        name: 'Admin User',
        email: 'admin@kwalas.com',
        password: hashedPassword,
        role: 'admin'
    });

    console.log('👑 Admin user created: admin@kwalas.com / admin123');
    } else {
    console.log('⚠️ Admin user already exists. Skipping creation.');
    }


    console.log('✅ Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}

seed();
