const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const ProductTag = require('../models/producttag');
const redis = require('../utils/redis');

// ------------------------------
// SEARCH PRODUCTS
// ------------------------------
exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Query (q) is required' });

    const cacheKey = `search:q=${q}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // Case-insensitive $regex search
    const regex = new RegExp(q, 'i');
    const results = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { short_desc: regex },
        { meta_title: regex },
        { meta_description: regex }
      ]
    })
      .populate('category_id')
      .populate('brand_id')
      .lean();

    await redis.set(cacheKey, JSON.stringify(results), 'EX', 300); // 5 mins
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
};

// ------------------------------
// FILTER PRODUCTS
// ------------------------------
exports.filterProducts = async (req, res) => {
  try {
    const cacheKey = `filter:${JSON.stringify(req.query)}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const { category, brand, minPrice, maxPrice, tag } = req.query;
    const filter = {};

    if (category) filter.category_id = category;
    if (brand) filter.brand_id = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let products;

    if (tag) {
      // Join on tags using manual lookup
      const tagDoc = await ProductTag.findOne({ slug: tag });
      if (!tagDoc) return res.json([]); // no products if tag doesn't exist

      products = await Product.find({
        ...filter,
        tags: tagDoc._id
      })
        .populate('category_id')
        .populate('brand_id')
        .lean();
    } else {
      products = await Product.find(filter)
        .populate('category_id')
        .populate('brand_id')
        .lean();
    }

    await redis.set(cacheKey, JSON.stringify(products), 'EX', 300);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Filter failed' });
  }
};
