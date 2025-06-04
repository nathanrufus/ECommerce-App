require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const slugify = require('slugify');
const { cloudinary } = require('../utils/cloudinary');


const Product = require('../models/product');
const Category = require('../models/category');
const MediaFile = require('../models/mediafile');

const PRODUCT_LIMIT = 20;

const CATEGORY_MAP = [
  { name: 'Laptops', url: 'https://www.jumia.co.ke/catalog/?q=laptop' },
  { name: 'CPUs', url: 'https://www.jumia.co.ke/catalog/?q=cpu' },
  { name: 'Mouse', url: 'https://www.jumia.co.ke/catalog/?q=mouse' },
  { name: 'Phone', url: 'https://www.jumia.co.ke/catalog/?q=phone' },
  { name: 'iPhone', url: 'https://www.jumia.co.ke/catalog/?q=iphone' },
];


async function scrapeProductsFromURL(categoryUrl, limit = PRODUCT_LIMIT) {
  const res = await axios.get(categoryUrl);
  const $ = cheerio.load(res.data);
  const products = [];

  const links = $('article.prd a.core').map((i, el) => $(el).attr('href')).get();

  for (const link of links.slice(0, limit)) {
    const productURL = `https://www.jumia.co.ke${link}`;
    try {
      const detailRes = await axios.get(productURL);
      const $$ = cheerio.load(detailRes.data);

      const name = $$('h1.-fs20').first().text().trim();
      const priceText = $$('span.-b.-ltr.-tal.-fs24').first().text().replace(/[^\d]/g, '');
      const description = $$('#product-description').text().trim();

      const images = [];
      $$('.img > img').each((i, el) => {
        const src = $$(el).attr('data-src') || $$(el).attr('src');
        if (src && images.length < 5) images.push(src);
      });

      if (name && priceText && images.length) {
        products.push({
          name,
          price: parseInt(priceText, 10),
          description,
          short_desc: '',
          images
        });
      }
    } catch (err) {
      console.warn(`⚠️ Failed to fetch product page: ${productURL}`);
    }
  }

  return products;
}

async function seedToDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  for (const { name, url } of CATEGORY_MAP) {
    const category = await Category.findOne({ name });
    if (!category) {
      console.warn(`⚠️ Category "${name}" not found in DB. Skipping.`);
      continue;
    }

    console.log(`⏳ Scraping category: ${name}`);
    const scrapedProducts = await scrapeProductsFromURL(url);

    for (const item of scrapedProducts) {
      const slug = slugify(item.name, { lower: true });
      const exists = await Product.findOne({ slug });
      if (exists) continue;

      const product = await Product.create({
        name: item.name,
        slug,
        description: item.description,
        short_desc: item.short_desc,
        price: item.price,
        stock_quantity: 10,
        category_id: category._id,
        brand_id: null,
        meta_title: item.name,
        meta_description: item.name,
        tags: [],
      });

      for (const url of item.images) {
        try {
          const uploadRes = await cloudinary.uploader.upload(url, {
            folder: 'products',
          });

          await MediaFile.create({
            product_id: product._id,
            file_url: uploadRes.secure_url,
            file_type: uploadRes.resource_type,
            public_id: uploadRes.public_id,
          });
        } catch (err) {
          console.warn(`⚠️ Cloudinary upload failed for ${url}: ${err.message}`);
        }
      }

      console.log(`✅ Saved: ${item.name}`);
    }

    console.log(`✅ Done with category: ${name}`);
    await new Promise(res => setTimeout(res, 2000)); // delay to avoid blocking
  }

  await mongoose.disconnect();
  console.log('🎉 All categories completed.');
}

seedToDatabase();
