const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order_date: Date,
  status: String,
  total_amount: Number,
  shipping_address: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);