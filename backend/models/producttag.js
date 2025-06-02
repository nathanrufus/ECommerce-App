const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: String,
  slug: String
}, { timestamps: true });
module.exports = mongoose.model('ProductTag', tagSchema);