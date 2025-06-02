const mongoose = require('mongoose');

const mediaFileSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  file_url: String,
  file_type: String
}, { timestamps: true });
module.exports = mongoose.model('MediaFile', mediaFileSchema);