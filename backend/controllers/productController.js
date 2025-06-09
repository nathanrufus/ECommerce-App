const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const MediaFile = require('../models/mediafile');
const Review = require('../models/review');
const User = require('../models/user');
const slugify = require('slugify');

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      short_desc,
      price,
      stock_quantity,
      category_id,
      brand_id,
      meta_title,
      meta_description,
      tag_ids
    } = req.body;

    const slug = slugify(name, { lower: true });

    const product = new Product({
      name,
      slug,
      description,
      short_desc,
      price,
      stock_quantity,
      category_id,
      brand_id,
      meta_title,
      meta_description,
      tags: tag_ids // <-- this line fixes your issue
    });
    await product.save();


    // Store media file URLs
    if (req.files && req.files.length > 0) {
      const mediaEntries = req.files.map(file => ({
        product_id: product._id,
        file_url: file.path, // Cloudinary URL
        file_type: file.mimetype
      }));
      await MediaFile.insertMany(mediaEntries);
    }

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };

    // Parse tag_ids if it's coming as a string (e.g., from FormData)
    if (typeof updates.tag_ids === 'string') {
      try {
        updates.tag_ids = JSON.parse(updates.tag_ids);
      } catch (err) {
        console.warn('tag_ids not parsed as JSON, assuming form-encoded array');
        updates.tag_ids = [updates.tag_ids]; // fallback
      }
    }

    // Map tag_ids to tags
    if (updates.tag_ids) {
      updates.tags = updates.tag_ids;
      delete updates.tag_ids;
    }

    // Slugify if name is updated
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true });
    }

    await Product.findByIdAndUpdate(id, updates);

    if (req.files && req.files.length > 0) {
      const media = req.files.map(file => ({
        product_id: id,
        file_url: file.path,
        file_type: file.mimetype,
        public_id: file.filename
      }));
      await MediaFile.insertMany(media);
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    await MediaFile.deleteMany({ product_id: id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
   const products = await Product.find().populate('tags').lean();

    const productIds = products.map(p => p._id);
    const mediaFiles = await MediaFile.find({ product_id: { $in: productIds } }).lean();

    const enrichedProducts = products.map(product => ({
      ...product,
      media_files: mediaFiles.filter(m => m.product_id.toString() === product._id.toString())
    }));

    res.json(enrichedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};


// GET PRODUCT BY SLUG
exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.findOne({ slug })
      .populate('category_id')
      .populate('brand_id')
      .lean();

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const media = await MediaFile.find({ product_id: product._id });

    const reviews = await Review.find({ product_id: product._id })
      .populate({ path: 'customer_id', select: 'name email' })
      .sort({ createdAt: -1 });

    const related = await Product.find({
      category_id: product.category_id,
      slug: { $ne: slug }
    }).limit(4).lean();

    const relatedIds = related.map(r => r._id);
    const relatedMedia = await MediaFile.find({ product_id: { $in: relatedIds } });

    const relatedWithMedia = related.map(r => ({
      ...r,
      media_files: relatedMedia.filter(m => m.product_id.toString() === r._id.toString())
    }));

    res.json({
      product: { ...product, media_files: media },
      related: relatedWithMedia,
      reviews
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// controller/productController.js
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id)
      .populate('category_id')
      .populate('brand_id')
      .lean();

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const media = await MediaFile.find({ product_id: id });

    res.json({ ...product, MediaFiles: media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};
// GET PRODUCTS BY CATEGORY SLUG
exports.getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const products = await Product.find({ category_id: category._id })
      .populate('tags') // this is the fix
      .lean();

    const productIds = products.map(p => p._id);
    const mediaFiles = await MediaFile.find({ product_id: { $in: productIds } }).lean();

    const enrichedProducts = products.map(product => ({
      ...product,
      media_files: mediaFiles.filter(m => m.product_id.toString() === product._id.toString())
    }));

    res.json(enrichedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// GET ALL BRANDS
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};
