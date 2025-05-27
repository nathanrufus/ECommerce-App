const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Customer routes
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);

// Admin route
router.patch('/orders/:id/status', authMiddleware, roleMiddleware('admin'), orderController.updateOrderStatus);

module.exports = router;