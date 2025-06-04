require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');

const MONGO_URI = process.env.MONGODB_URI;

// ✅ Your brand IDs
const BRANDS = [
  '684066189a95385efbd78cf7', // Dell
  '684066189a95385efbd78cf8', // HP
  '684066189a95385efbd78cf9', // Apple
  '684066189a95385efbd78cfa', // Lenovo
  '684066189a95385efbd78cfb'  // Samsung
];

function getRandomBrandId() {
  return BRANDS[Math.floor(Math.random() * BRANDS.length)];
}

const products = [
  // Mouse
  {
    name: 'Logitech MX Master 3 Wireless Mouse',
    price: 99.99,
    description: 'An ergonomic wireless mouse designed for power users. Features ultra-fast scrolling, customizable buttons, and advanced tracking on any surface. Ideal for creatives and programmers.',
    category_id: '684066179a95385efbd78cf1'
  },
  {
    name: 'Razer DeathAdder V2 Gaming Mouse',
    price: 69.99,
    description: 'A high-precision wired gaming mouse with 20K DPI optical sensor and ergonomic design. Delivers smooth performance and fast response times. Ideal for FPS and esports players.',
    category_id: '684066179a95385efbd78cf1'
  },
  {
    name: 'HP X500 Wired Optical Mouse',
    price: 14.95,
    description: 'Simple and reliable USB optical mouse from HP. Plug-and-play functionality with a comfortable grip. Suited for everyday work and browsing.',
    category_id: '684066179a95385efbd78cf1'
  },

  // Phone
  {
    name: 'Samsung Galaxy S23 Ultra (256GB)',
    price: 1199.99,
    description: 'Samsung’s flagship phone featuring a 6.8-inch QHD+ AMOLED display, Snapdragon 8 Gen 2 processor, 200MP camera, and S Pen support. Comes with 256GB storage and 5G connectivity.',
    category_id: '684066179a95385efbd78cf2'
  },
  {
    name: 'Google Pixel 7 Pro (128GB, Unlocked)',
    price: 899.00,
    description: 'Pixel 7 Pro delivers clean Android experience with Google\'s Tensor G2 chip, 120Hz LTPO OLED display, and pro-level triple camera system. 5G-enabled and water-resistant.',
    category_id: '684066179a95385efbd78cf2'
  },
  {
    name: 'Xiaomi Redmi Note 12 5G',
    price: 279.99,
    description: 'Affordable 5G smartphone with 6.67-inch AMOLED display, Snapdragon 4 Gen 1 chipset, 48MP triple camera, and 5000mAh battery. Value-packed for everyday use.',
    category_id: '684066179a95385efbd78cf2'
  },

  // iPhone
  {
    name: 'iPhone 14 Pro Max (512GB, Space Black)',
    price: 1399.00,
    description: 'Apple’s top-tier iPhone with A16 Bionic chip, 6.7-inch Super Retina XDR display with ProMotion, Dynamic Island, and triple 48MP camera system. Unmatched performance and battery life.',
    category_id: '684066179a95385efbd78cf3'
  },
  {
    name: 'iPhone 13 Mini (128GB, Blue)',
    price: 699.00,
    description: 'Compact yet powerful, the iPhone 13 Mini offers A15 Bionic performance, 5.4-inch OLED display, and dual-camera setup in a pocket-sized form factor. Great for one-handed use.',
    category_id: '684066179a95385efbd78cf3'
  },
  {
    name: 'iPhone SE (2022, 64GB, Product Red)',
    price: 429.00,
    description: 'Budget iPhone powered by the A15 Bionic chip. Touch ID with 4.7-inch Retina display. Classic design with modern speed and 5G connectivity.',
    category_id: '684066179a95385efbd78cf3'
  },

  // Samsung Tablets
  {
    name: 'Samsung Galaxy Tab S8 Ultra (14.6" 5G)',
    price: 1099.99,
    description: 'Premium tablet with 14.6-inch Super AMOLED display, Snapdragon 8 Gen 1 processor, S Pen, and 5G support. Designed for professionals and creative work on the go.',
    category_id: '684066179a95385efbd78cf4'
  },
  {
    name: 'Samsung Galaxy Tab A8 (10.5", Wi-Fi, 64GB)',
    price: 229.99,
    description: 'Affordable and reliable tablet with 10.5-inch display, quad speakers, 7040mAh battery, and expandable storage. Great for students and media consumption.',
    category_id: '684066179a95385efbd78cf4'
  },
  {
    name: 'Samsung Galaxy Tab S6 Lite (2022 Edition)',
    price: 349.99,
    description: 'Mid-range tablet offering 10.4-inch display, S Pen support, and long battery life. Perfect for note-taking, browsing, and casual productivity tasks.',
    category_id: '684066179a95385efbd78cf4'
  }
];

const formattedProducts = products.map((item) => {
  const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const short_desc = item.description.slice(0, 120);
  const meta_description = item.description.slice(0, 160);

  return {
    name: item.name,
    slug,
    description: item.description,
    short_desc,
    price: item.price,
    stock_quantity: Math.floor(Math.random() * 20) + 5,
    category_id: item.category_id,
    brand_id: getRandomBrandId(),
    meta_title: item.name,
    meta_description,
    tags: []
  };
});

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.insertMany(formattedProducts);
    console.log(`✅ Seeded ${formattedProducts.length} products`);

    process.exit();
  } catch (err) {
    console.error('❌ Error seeding products:', err);
    process.exit(1);
  }
}

seedProducts();
