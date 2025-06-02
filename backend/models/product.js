const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  short_desc: String,
  price: Number,
  stock_quantity: Number,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  meta_title: String,
  meta_description: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductTag' }]
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);