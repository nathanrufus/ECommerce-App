const { Product, Category, Brand, MediaFile } = require('../models');
const slugify = require('slugify');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, short_desc, price, stock_quantity, category_id, brand_id, meta_title, meta_description } = req.body;
    const slug = slugify(name, { lower: true });

    const product = await Product.create({
      name,
      slug,
      description,
      short_desc,
      price,
      stock_quantity,
      category_id,
      brand_id,
      meta_title,
      meta_description
    });

    if (req.files) {
      const media = req.files.map(file => ({
        product_id: product.id,
        file_url: `/uploads/${file.filename}`,
        file_type: file.mimetype
      }));
      await MediaFile.bulkCreate(media);
    }

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    if (updates.name) updates.slug = slugify(updates.name, { lower: true });

    await Product.update(updates, { where: { id } });

    if (req.files) {
      const media = req.files.map(file => ({
        product_id: id,
        file_url: `/uploads/${file.filename}`,
        file_type: file.mimetype
      }));
      await MediaFile.bulkCreate(media);
    }

    res.json({ message: 'Product updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.destroy({ where: { id } });
    await MediaFile.destroy({ where: { product_id: id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [Category, Brand, MediaFile] });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ where: { slug }, include: [Category, Brand, MediaFile] });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};
