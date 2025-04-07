
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new coupon - Admin only
router.post('/', protect, admin, couponController.createCoupon);

// Get all coupons - Admin only
router.get('/', protect, admin, couponController.getAllCoupons);

// Validate coupon
router.post('/validate', protect, couponController.validateCoupon);

// Get coupon by code
router.get('/:code', protect, couponController.getCouponByCode);

// Update coupon - Admin only
router.put('/:id', protect, admin, couponController.updateCoupon);

// Delete coupon - Admin only
router.delete('/:id', protect, admin, couponController.deleteCoupon);

module.exports = router;
