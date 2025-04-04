
import { Order, OrderStatus, CartItem, User } from "@/types";
import { updateStock } from "./productService";

// In-memory storage for orders
let orders: Order[] = [];

export const createOrder = async (
  userId: string,
  items: CartItem[],
  subtotal: number,
  gst: number,
  discountAmount: number,
  couponCode?: string
): Promise<Order> => {
  // Verify stock availability
  for (const item of items) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Not enough stock for ${item.product.name}`);
    }
  }
  
  // Create new order
  const newOrder: Order = {
    id: `order-${Date.now()}`,
    userId,
    items,
    subtotal,
    gst,
    discountAmount,
    totalAmount: subtotal + gst - discountAmount,
    couponCode,
    status: OrderStatus.PLACED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Update product stock
  for (const item of items) {
    await updateStock(
      item.product.id, 
      item.product.stock - item.quantity
    );
  }
  
  orders.push(newOrder);
  return newOrder;
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return orders.find(order => order.id === id);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return orders.filter(order => order.userId === userId);
};

export const getAllOrders = async (): Promise<Order[]> => {
  return [...orders];
};

export const updateOrderStatus = async (
  id: string, 
  status: OrderStatus
): Promise<Order | null> => {
  const order = orders.find(order => order.id === id);
  if (!order) return null;
  
  order.status = status;
  order.updatedAt = new Date().toISOString();
  
  return order;
};

export const cancelOrder = async (id: string): Promise<Order | null> => {
  const order = orders.find(order => order.id === id);
  if (!order) return null;
  
  // Only allow cancellation if order is not delivered
  if (order.status === OrderStatus.DELIVERED) {
    throw new Error("Cannot cancel a delivered order");
  }
  
  order.status = OrderStatus.CANCELLED;
  order.updatedAt = new Date().toISOString();
  
  // Return items to stock if order is cancelled
  for (const item of order.items) {
    const currentProduct = item.product;
    await updateStock(
      currentProduct.id,
      currentProduct.stock + item.quantity
    );
  }
  
  return order;
};

export const getOrderStatusCounts = async (): Promise<Record<OrderStatus, number>> => {
  const counts = {
    [OrderStatus.PLACED]: 0,
    [OrderStatus.PACKED]: 0,
    [OrderStatus.SHIPPING]: 0,
    [OrderStatus.DELIVERED]: 0,
    [OrderStatus.CANCELLED]: 0,
  };
  
  for (const order of orders) {
    counts[order.status]++;
  }
  
  return counts;
};

export const getRecentOrders = async (limit: number = 5): Promise<Order[]> => {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getTotalSales = async (): Promise<number> => {
  return orders
    .filter(order => order.status !== OrderStatus.CANCELLED)
    .reduce((total, order) => total + order.totalAmount, 0);
};

export const getOrderCount = async (): Promise<number> => {
  return orders.filter(order => order.status !== OrderStatus.CANCELLED).length;
};

export const getAverageOrderValue = async (): Promise<number> => {
  const relevantOrders = orders.filter(
    order => order.status !== OrderStatus.CANCELLED
  );
  
  if (relevantOrders.length === 0) return 0;
  
  const totalSales = relevantOrders.reduce(
    (total, order) => total + order.totalAmount, 
    0
  );
  
  return totalSales / relevantOrders.length;
};
