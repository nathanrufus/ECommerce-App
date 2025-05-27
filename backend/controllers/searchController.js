const { Product, Category, Brand, ProductTag, Sequelize } = require('../models');
const { Op } = Sequelize;
const redis = require('../utils/redis'); 

exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q;
    const cacheKey = `search:q=${q}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const results = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { short_desc: { [Op.iLike]: `%${q}%` } },
          { meta_title: { [Op.iLike]: `%${q}%` } },
          { meta_description: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [Category, Brand]
    });

    await redis.set(cacheKey, JSON.stringify(results), 'EX', 300); // cache for 5 mins
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const cacheKey = `filter:${JSON.stringify(req.query)}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const { category, brand, minPrice, maxPrice, tag } = req.query;
    const where = {};

    if (category) where.category_id = category;
    if (brand) where.brand_id = brand;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const include = [Category, Brand];

    if (tag) {
      include.push({
        model: ProductTag,
        where: { slug: tag },
        through: { attributes: [] }
      });
    }

    const products = await Product.findAll({
      where,
      include
    });

    await redis.set(cacheKey, JSON.stringify(products), 'EX', 300); // cache for 5 mins
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Filter failed' });
  }
};
