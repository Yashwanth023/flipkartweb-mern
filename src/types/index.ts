
export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin"
}

export enum OrderStatus {
  PLACED = "Order Placed",
  PACKED = "Packed",
  SHIPPING = "Shipping",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  address: string;
  dateOfBirth?: string;
  password: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  minimumCartValue: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  gst: number;
  discountAmount: number;
  couponCode?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SalesMetric {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface InventoryMetric {
  lowStockProducts: Product[];
  totalProducts: number;
  outOfStockProducts: number;
}

export interface CouponMetric {
  totalCouponsUsed: number;
  totalDiscountsGiven: number;
  activeCoupons: number;
}

export interface DashboardMetrics {
  sales: SalesMetric;
  inventory: InventoryMetric;
  coupons: CouponMetric;
  recentOrders: Order[];
  orderStatusCounts: Record<OrderStatus, number>;
}
