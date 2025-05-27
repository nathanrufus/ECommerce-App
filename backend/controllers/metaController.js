const { Category, Brand, ProductTag } = require('../models');
const slugify = require('slugify');

exports.createCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    const slug = slugify(name, { lower: true });
    const category = await Category.create({ name, slug, parent_id });
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
    const brand = await Brand.create({ name, slug });
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
    const tag = await ProductTag.create({ name, slug });
    res.status(201).json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating tag' });
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

exports.getTags = async (req, res) => {
  try {
    const tags = await ProductTag.findAll();
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tags' });
  }
};
