const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });
module.exports = mongoose.model('Wishlist', wishlistSchema);