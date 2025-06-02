const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  parent_id: mongoose.Schema.Types.ObjectId,
  thumbnail_url: String 
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);