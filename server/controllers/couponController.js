
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      minimumCartValue,
      validFrom,
      validUntil,
      isActive,
      usageLimit,
      applicableCategories,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercentage,
      minimumCartValue: minimumCartValue || 0,
      validFrom: validFrom || new Date(),
      validUntil,
      isActive: isActive !== undefined ? isActive : true,
      usageLimit: usageLimit || null,
      applicableCategories: applicableCategories || [],
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// @desc    Get coupon by code
// @route   GET /api/coupons/:code
// @access  Private
exports.getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupon', error: error.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid coupon ID format' });
    }
    
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    const {
      code,
      discountPercentage,
      minimumCartValue,
      validFrom,
      validUntil,
      isActive,
      usageLimit,
      applicableCategories,
    } = req.body;
    
    // If code is being changed, check for uniqueness
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      coupon.code = code.toUpperCase();
    }
    
    if (discountPercentage !== undefined) coupon.discountPercentage = discountPercentage;
    if (minimumCartValue !== undefined) coupon.minimumCartValue = minimumCartValue;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    
    const updatedCoupon = await coupon.save();
    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid coupon ID format' });
    }
    
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    await coupon.remove();
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartValue } = req.body;
    
    if (!code || cartValue === undefined) {
      return res.status(400).json({ message: 'Please provide coupon code and cart value' });
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    const isValid = coupon.isValid(cartValue);
    
    if (!isValid) {
      return res.status(400).json({ 
        message: 'Coupon is not valid',
        reasons: {
          isActive: coupon.isActive,
          validDates: new Date() >= coupon.validFrom && new Date() <= coupon.validUntil,
          minimumCartValue: cartValue >= coupon.minimumCartValue,
          usageLimit: coupon.usageLimit === null || coupon.timesUsed < coupon.usageLimit,
        }
      });
    }
    
    // Calculate discount
    const discountAmount = (cartValue * coupon.discountPercentage) / 100;
    
    res.status(200).json({
      valid: true,
      coupon,
      discountAmount,
      finalPrice: cartValue - discountAmount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating coupon', error: error.message });
  }
};
