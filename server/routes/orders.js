
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create new order
router.post('/', protect, orderController.createOrder);

// Get logged in user orders
router.get('/myorders', protect, orderController.getMyOrders);

// Get order statistics
router.get('/stats', protect, admin, orderController.getOrderStats);

// Get order by ID
router.get('/:id', protect, orderController.getOrderById);

// Update order to paid
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

// Update order status
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);

// Get all orders - Admin only
router.get('/', protect, admin, orderController.getOrders);

module.exports = router;
