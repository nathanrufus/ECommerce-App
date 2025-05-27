const { Order, OrderItem, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    const customer_id = req.user.id;

    let total_amount = 0;

    // Validate products and calculate total
    const orderItems = await Promise.all(items.map(async item => {
      const product = await Product.findByPk(item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        throw new Error(`Invalid or insufficient stock for product ID ${item.product_id}`);
      }

      const lineTotal = item.quantity * product.price;
      total_amount += lineTotal;

      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      };
    }));

    // Create order
    const order = await Order.create({
      customer_id,
      order_date: new Date(),
      status: 'pending',
      total_amount,
      shipping_address
    });

    // Save order items
    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        order_id: order.id
      });

      // Decrease product stock
      await Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { id: item.product_id }
      });
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.id },
      include: [OrderItem]
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, customer_id: req.user.id },
      include: [OrderItem]
    });
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
    await Order.update({ status }, { where: { id: req.params.id } });
    res.json({ message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
};