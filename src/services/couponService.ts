
import { Coupon } from "@/types";

// In-memory storage for coupons using the mock data from CartContext
let coupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    discountPercentage: 20,
    minimumCartValue: 1000,
    validFrom: "2023-01-01",
    validUntil: "2025-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "SAVE10",
    discountPercentage: 10,
    minimumCartValue: 500,
    validFrom: "2023-01-01",
    validUntil: "2025-12-31",
    isActive: true,
  },
];

export const getAllCoupons = async (): Promise<Coupon[]> => {
  return [...coupons];
};

export const getCouponByCode = async (code: string): Promise<Coupon | undefined> => {
  return coupons.find(coupon => coupon.code === code);
};

export const validateCoupon = async (
  code: string, 
  cartValue: number
): Promise<{ valid: boolean; message: string; coupon?: Coupon }> => {
  const coupon = await getCouponByCode(code);
  
  if (!coupon) {
    return { valid: false, message: "Coupon not found" };
  }
  
  if (!coupon.isActive) {
    return { valid: false, message: "Coupon is inactive" };
  }
  
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);
  
  if (now < validFrom) {
    return { valid: false, message: "Coupon is not yet valid" };
  }
  
  if (now > validUntil) {
    return { valid: false, message: "Coupon has expired" };
  }
  
  if (cartValue < coupon.minimumCartValue) {
    return { 
      valid: false, 
      message: `Minimum cart value of ₹${coupon.minimumCartValue} not met` 
    };
  }
  
  return { 
    valid: true, 
    message: `${coupon.discountPercentage}% discount applied`, 
    coupon 
  };
};

// Admin functions
export const createCoupon = async (couponData: Omit<Coupon, "id">): Promise<Coupon> => {
  const newCoupon: Coupon = {
    ...couponData,
    id: `coupon-${Date.now()}`,
  };
  
  coupons.push(newCoupon);
  return newCoupon;
};

export const updateCoupon = async (id: string, updates: Partial<Coupon>): Promise<Coupon | null> => {
  const index = coupons.findIndex(coupon => coupon.id === id);
  if (index === -1) return null;
  
  coupons[index] = { ...coupons[index], ...updates };
  return coupons[index];
};

export const deleteCoupon = async (id: string): Promise<boolean> => {
  const initialLength = coupons.length;
  coupons = coupons.filter(coupon => coupon.id !== id);
  return coupons.length < initialLength;
};

export const toggleCouponStatus = async (id: string): Promise<Coupon | null> => {
  const coupon = coupons.find(coupon => coupon.id === id);
  if (!coupon) return null;
  
  coupon.isActive = !coupon.isActive;
  return coupon;
};

export const getActiveCouponsCount = async (): Promise<number> => {
  return coupons.filter(coupon => coupon.isActive).length;
};

export const getTotalDiscountGiven = async (orders: any[]): Promise<number> => {
  // In a real app, this would calculate actual discount amounts from orders
  // For demonstration, we'll return a mock value
  return orders.reduce((total, order) => total + (order.discountAmount || 0), 0);
};

export const getTotalCouponsUsed = async (orders: any[]): Promise<number> => {
  // Count unique coupon codes used in orders
  const usedCoupons = new Set(
    orders
      .filter(order => order.couponCode)
      .map(order => order.couponCode)
  );
  
  return usedCoupons.size;
};
