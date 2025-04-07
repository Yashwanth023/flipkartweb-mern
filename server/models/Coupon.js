
const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a coupon code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Please add a discount percentage'],
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    minimumCartValue: {
      type: Number,
      required: [true, 'Please add a minimum cart value'],
      min: [0, 'Minimum cart value cannot be negative'],
      default: 0,
    },
    validFrom: {
      type: Date,
      required: [true, 'Please add a valid from date'],
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: [true, 'Please add a valid until date'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    applicableCategories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Check if coupon is valid
couponSchema.methods.isValid = function (cartValue) {
  const now = new Date();
  
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    cartValue >= this.minimumCartValue &&
    (this.usageLimit === null || this.timesUsed < this.usageLimit)
  );
};

module.exports = mongoose.model('Coupon', couponSchema);
