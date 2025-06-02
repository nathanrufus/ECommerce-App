const Order = require('../models/order');
const OrderItem = require('../models/orderitem');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    const customer_id = req.user.id;

    let total_amount = 0;
    const orderItemIds = [];

    // Validate products and calculate totals
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        throw new Error(`Invalid or insufficient stock for product ID ${item.product_id}`);
      }

      const lineTotal = item.quantity * product.price;
      total_amount += lineTotal;

      // Create and save order item
      const orderItem = new OrderItem({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
      await orderItem.save();
      orderItemIds.push(orderItem._id);

      // Decrease stock
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock_quantity: -item.quantity }
      });
    }

    // Create and save order
    const order = new Order({
      customer_id,
      order_date: new Date(),
      status: 'pending',
      total_amount,
      shipping_address,
      items: orderItemIds
    });
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user.id }).populate('items');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer_id: req.user.id
    }).populate('items');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};
