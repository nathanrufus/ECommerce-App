const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: String,            // Guest name
  email: String,           // Guest email
  phone: String,           // Guest phone
  order_date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  total_amount: Number,
  shipping_address: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
