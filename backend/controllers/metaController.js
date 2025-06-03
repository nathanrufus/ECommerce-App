const Category = require('../models/category');
const Brand = require('../models/brand');
const ProductTag = require('../models/producttag');
const slugify = require('slugify');

// ----------------------------
// CREATE CONTROLLERS
// ----------------------------

exports.createCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    const slug = slugify(name, { lower: true });

    const thumbnail_url = req.file ? req.file.path : null;

    const category = new Category({
      name,
      slug,
      parent_id,
      thumbnail_url,
    });

    await category.save();
    res.status(201).json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating category' });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const brand = new Brand({ name, slug });
    await brand.save();
    res.status(201).json({ brand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating brand' });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const tag = new ProductTag({ name, slug });
    await tag.save();
    res.status(201).json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating tag' });
  }
};

// ----------------------------
// FETCH CONTROLLERS
// ----------------------------

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await ProductTag.find();
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};

// ----------------------------
// DELETE CONTROLLERS
// ----------------------------

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting category' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.findByIdAndDelete(id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting brand' });
  }
};
