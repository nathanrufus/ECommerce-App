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


    // 4. Products
    const products = [];

    for (let i = 0; i < 10; i++) {
      const category = faker.helpers.arrayElement(categoryDocs);
        const brand = faker.helpers.arrayElement(brandDocs);
        const tags = faker.helpers.arrayElements(tagDocs, 2);

      const product = new Product({
        name: faker.commerce.productName(),
        slug: faker.helpers.slugify(faker.commerce.productName().toLowerCase()),
        description: faker.commerce.productDescription(),
        short_desc: faker.lorem.sentence(),
        price: faker.commerce.price(500, 2000),
        stock_quantity: faker.number.int({ min: 10, max: 100 }),
        category_id: category._id,
        brand_id: brand._id,
        meta_title: faker.lorem.words(5),
        meta_description: faker.lorem.sentence(),
        tags: tags.map(tag => tag._id)
      });

      await product.save();

      await MediaFile.create({
        product_id: product._id,
        file_url: 'https://via.placeholder.com/600x400', // placeholder image
        file_type: 'image/jpeg'
      });

      products.push(product);
    }

    console.log('✅ Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}

seed();
