
import { DashboardMetrics, Order } from "@/types";
import { 
  getOrderStatusCounts, 
  getRecentOrders,
  getTotalSales,
  getOrderCount,
  getAverageOrderValue
} from "./orderService";
import { 
  getProductsLowStock, 
  getOutOfStockProducts,
  getAllProducts
} from "./productService";
import {
  getActiveCouponsCount,
  getTotalDiscountGiven,
  getTotalCouponsUsed
} from "./couponService";

export const getDashboardMetrics = async (orders: Order[]): Promise<DashboardMetrics> => {
  // Get all the metrics in parallel
  const [
    totalSales,
    orderCount,
    averageOrderValue,
    lowStockProducts,
    outOfStockCount,
    totalProducts,
    activeCoupons,
    orderStatusCounts,
    recentOrders
  ] = await Promise.all([
    getTotalSales(),
    getOrderCount(),
    getAverageOrderValue(),
    getProductsLowStock(5),
    getOutOfStockProducts().then(products => products.length),
    getAllProducts().then(products => products.length),
    getActiveCouponsCount(),
    getOrderStatusCounts(),
    getRecentOrders(5)
  ]);

  // These would be calculated from real order data in a real app
  const totalDiscountsGiven = await getTotalDiscountGiven(orders);
  const totalCouponsUsed = await getTotalCouponsUsed(orders);

  return {
    sales: {
      totalSales,
      orderCount,
      averageOrderValue
    },
    inventory: {
      lowStockProducts,
      outOfStockProducts: outOfStockCount,
      totalProducts
    },
    coupons: {
      activeCoupons,
      totalDiscountsGiven,
      totalCouponsUsed
    },
    recentOrders,
    orderStatusCounts
  };
};
