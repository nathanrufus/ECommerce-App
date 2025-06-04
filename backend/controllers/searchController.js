const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const ProductTag = require('../models/producttag');
const redis = require('../utils/redis');
const MediaFile = require('../models/mediafile');


// ------------------------------
// SEARCH PRODUCTS
// ------------------------------
exports.searchProducts = async (req, res) => {
  try {
    const qRaw = req.query.q;

    // 🔐 Validate input
    if (!qRaw || typeof qRaw !== 'string') {
      return res.status(400).json({ message: 'Query (q) is required' });
    }

    const q = qRaw.trim();
    if (q.length < 2) {
      return res.status(400).json({ message: 'Search query too short' });
    }

    const cacheKey = `search:q=${q}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const regex = new RegExp(q, 'i');

    // 🧠 Only fetch top 10 results (customize if needed)
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { short_desc: regex },
        { meta_title: regex },
        { meta_description: regex }
      ]
    })
      .limit(10)
      .sort({ createdAt: -1 })
      .populate('category_id')
      .populate('brand_id')
      .lean();

    // ✅ Optional: fetch media_files for preview
    const productIds = products.map((p) => p._id);
    const mediaFiles = await MediaFile.find({ product_id: { $in: productIds } }).lean();

    const enriched = products.map((p) => ({
      ...p,
      media_files: mediaFiles.filter(m => m.product_id.toString() === p._id.toString())
    }));

    await redis.set(cacheKey, JSON.stringify(enriched), 'EX', 300); // 5 minutes

    res.json(enriched);
  } catch (err) {
    console.error('Search error:', err);
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

    const { category, brand, minPrice, maxPrice, tag, q } = req.query;
    const filter = {};

    // ✅ Keyword search (optional)
    if (q && typeof q === 'string' && q.trim().length >= 2) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { short_desc: regex },
        { meta_title: regex },
        { meta_description: regex },
      ];
    }

    // ✅ Convert category slug to _id
    if (category) {
      const catDoc = await Category.findOne({ slug: category }).lean();
      if (!catDoc) return res.json([]); // no results
      filter.category_id = catDoc._id;
    }

    // ✅ Convert brand slug to _id
    if (brand) {
      const brandDoc = await Brand.findOne({ slug: brand }).lean();
      if (!brandDoc) return res.json([]);
      filter.brand_id = brandDoc._id;
    }

    // ✅ Handle price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    let products;

    if (tag) {
      const tagDoc = await ProductTag.findOne({ slug: tag }).lean();
      if (!tagDoc) return res.json([]);
      products = await Product.find({
        ...filter,
        tags: tagDoc._id,
      })
        .populate('category_id brand_id tags')
        .lean();
    } else {
      products = await Product.find(filter)
        .populate('category_id brand_id tags')
        .lean();
    }

    // ✅ Attach media_files
    const productIds = products.map((p) => p._id);
    const mediaFiles = await MediaFile.find({ product_id: { $in: productIds } }).lean();

    const enriched = products.map((p) => ({
      ...p,
      media_files: mediaFiles.filter((m) => m.product_id.toString() === p._id.toString()),
    }));

    await redis.set(cacheKey, JSON.stringify(enriched), 'EX', 300); // Cache for 5 min
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Filter failed' });
  }
};

