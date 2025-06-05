const Order = require('../models/order');
const OrderItem = require('../models/orderitem');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address, name, email, phone } = req.body;
    const customer_id = req.user?.id || null;

    let total_amount = 0;
    const orderItemIds = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        throw new Error(`Invalid or insufficient stock for product ID ${item.product_id}`);
      }

      const lineTotal = item.quantity * product.price;
      total_amount += lineTotal;

      const orderItem = new OrderItem({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
      await orderItem.save();
      orderItemIds.push(orderItem._id);

      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock_quantity: -item.quantity }
      });
    }

    const order = new Order({
      customer_id,
      name,
      email,
      phone,
      shipping_address,
      items: orderItemIds,
      total_amount,
      status: 'pending',
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

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'items',
        populate: { path: 'product_id', select: 'name price' },
      })
      .populate('customer_id', 'name email');

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items',
        populate: { path: 'product_id', select: 'name price' },
      })
      .populate('customer_id', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching order' });
  }
};
exports.trackOrderPublic = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items',
        populate: {
          path: 'product_id',
          select: 'name price'
        }
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
        _id: order._id,
        status: order.status,
        total_amount: order.total_amount,  // use consistent field
        placed_at: order.order_date,
        shipping_address: order.shipping_address,
        items: order.items
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error tracking order' });
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
// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Delete related order items
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    // Optionally restock products (optional logic)
    // for (const item of order.items) {
    //   await Product.findByIdAndUpdate(item.product_id, {
    //     $inc: { stock_quantity: item.quantity }
    //   });
    // }

    await Order.findByIdAndDelete(id);

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting order' });
  }
};
