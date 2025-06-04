const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Customer routes
router.post('/orders',  orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.get('/admin/orders', authMiddleware, roleMiddleware('admin'), orderController.getAllOrders);
router.get('/admin/orders/:id', authMiddleware, roleMiddleware('admin'), orderController.getOrderByIdAdmin);
router.get('/orders/track/:id', orderController.trackOrderPublic);


// Admin route
router.patch('/orders/:id/status', authMiddleware, roleMiddleware('admin'), orderController.updateOrderStatus);

module.exports = router;