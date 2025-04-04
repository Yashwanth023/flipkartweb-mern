
import { Product } from "@/types";
import { productData, getCategories as getProductCategories } from "@/data/productData";

// Get all products with optional filtering
export const getAllProducts = async (category?: string): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (category) {
    return productData.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }
  
  return productData;
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = productData.find(p => p.id === id);
  return product || null;
};

// Search products by query
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const lowerCaseQuery = query.toLowerCase();
  
  return productData.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) || 
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};

// Get products with low stock (for admin dashboard)
export const getProductsLowStock = async (threshold: number = 10): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return productData.filter(product => product.stock <= threshold)
    .sort((a, b) => a.stock - b.stock);
};

// Get products that are out of stock
export const getOutOfStockProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return productData.filter(product => product.stock === 0);
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return getProductCategories();
};

// Add a new product (admin only)
export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`
  };
  
  // In a real app, this would be an API call to save to the database
  productData.push(newProduct);
  
  return newProduct;
};

// Update a product (admin only)
export const updateProduct = async (id: string, updates: Partial<Omit<Product, "id">>): Promise<Product | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const productIndex = productData.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return null;
  }
  
  const updatedProduct = {
    ...productData[productIndex],
    ...updates
  };
  
  // In a real app, this would be an API call to update the database
  productData[productIndex] = updatedProduct;
  
  return updatedProduct;
};

// Delete a product (admin only)
export const deleteProduct = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const productIndex = productData.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return false;
  }
  
  // In a real app, this would be an API call to delete from the database
  productData.splice(productIndex, 1);
  
  return true;
};
