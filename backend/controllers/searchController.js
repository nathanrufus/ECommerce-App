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

    // ✅ Convert category slug to _id
    if (category) {
      const catDoc = await Category.findOne({ slug: category }).lean();
      if (!catDoc) return res.json([]); // no results
      filter.category_id = catDoc._id;
    }

    // ✅ Convert brand slug to _id (if you're passing slugs for brand too)
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
        tags: tagDoc._id
      }).populate('category_id brand_id tags').lean();
    } else {
      products = await Product.find(filter)
        .populate('category_id brand_id tags')
        .lean();
    }

    // ✅ Attach media_files
    const productIds = products.map(p => p._id);
    const mediaFiles = await MediaFile.find({ product_id: { $in: productIds } }).lean();

    const enriched = products.map(p => ({
      ...p,
      media_files: mediaFiles.filter(m => m.product_id.toString() === p._id.toString())
    }));

    await redis.set(cacheKey, JSON.stringify(enriched), 'EX', 300);
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Filter failed' });
  }
};
