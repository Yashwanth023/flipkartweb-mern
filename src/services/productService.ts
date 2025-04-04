
import { Product } from "@/types";

// Sample product data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience immersive sound quality with our premium noise-cancelling wireless headphones. Perfect for music lovers and professionals alike.",
    price: 1299,
    imageUrl: "/lovable-uploads/ae313758-e2a1-4cd4-b908-e68568f7f2e5.png",
    category: "Electronics",
    stock: 15,
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    description: "Stay connected and track your fitness goals with our latest smartwatch. Features include heart rate monitoring, GPS, and 3-day battery life.",
    price: 2499,
    imageUrl: "/lovable-uploads/25176adb-f0c3-451e-9c10-d86c85123bfb.png",
    category: "Electronics",
    stock: 10,
  },
  {
    id: "3",
    name: "Ultra HD 4K Smart TV",
    description: "Transform your living room with this stunning 55-inch 4K Smart TV featuring HDR technology and built-in streaming apps.",
    price: 32999,
    imageUrl: "/lovable-uploads/f54b10c4-2954-4a72-8e34-15c73459fce3.png",
    category: "Electronics",
    stock: 5,
  },
  {
    id: "4",
    name: "Professional DSLR Camera",
    description: "Capture life's special moments with exceptional clarity using our professional-grade DSLR camera with 24.2MP sensor and 4K video recording.",
    price: 45999,
    imageUrl: "/lovable-uploads/ee818ae4-ea49-4c36-a7f1-7fcf1066ce51.png",
    category: "Photography",
    stock: 8,
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    description: "Work in comfort with our ergonomically designed office chair featuring lumbar support, adjustable height, and breathable mesh material.",
    price: 7999,
    imageUrl: "/lovable-uploads/abae0cb6-11a4-450e-a0b8-29b08ad89401.png",
    category: "Furniture",
    stock: 12,
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    description: "Take your music anywhere with this compact yet powerful Bluetooth speaker featuring 20 hours of battery life and waterproof design.",
    price: 2999,
    imageUrl: "/lovable-uploads/8a8e2d0f-822d-413a-9651-547f1a3111a5.png",
    category: "Electronics",
    stock: 20,
  },
  {
    id: "7",
    name: "Premium Coffee Maker",
    description: "Start your day right with this programmable coffee maker featuring multiple brewing options and a built-in grinder for the freshest coffee.",
    price: 5499,
    imageUrl: "/lovable-uploads/182ee77b-8b60-4d47-9a94-831c9d65d41c.png",
    category: "Kitchen Appliances",
    stock: 7,
  },
  {
    id: "8",
    name: "Fitness Tracker Band",
    description: "Monitor your health metrics and workout performance with this water-resistant fitness tracker featuring heart rate monitoring and sleep analysis.",
    price: 1999,
    imageUrl: "/lovable-uploads/ae313758-e2a1-4cd4-b908-e68568f7f2e5.png",
    category: "Fitness",
    stock: 25,
  },
];

// In-memory storage for products
let products = [...mockProducts];

export const getAllProducts = async (): Promise<Product[]> => {
  return [...products];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  return products.filter(product => product.category === category);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterProducts = async (
  category?: string, 
  minPrice?: number, 
  maxPrice?: number
): Promise<Product[]> => {
  return products.filter(product => {
    let matches = true;
    
    if (category && product.category !== category) {
      matches = false;
    }
    
    if (minPrice !== undefined && product.price < minPrice) {
      matches = false;
    }
    
    if (maxPrice !== undefined && product.price > maxPrice) {
      matches = false;
    }
    
    return matches;
  });
};

// Admin functions
export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  const newProduct = {
    ...product,
    id: `product-${Date.now()}`,
  };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  return products[index];
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  return products.length < initialLength;
};

export const updateStock = async (id: string, newStock: number): Promise<boolean> => {
  const product = products.find(p => p.id === id);
  if (!product) return false;
  
  product.stock = newStock;
  return true;
};

export const getCategories = async (): Promise<string[]> => {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
};

export const getProductsLowStock = async (threshold: number = 5): Promise<Product[]> => {
  return products.filter(product => product.stock <= threshold);
};

export const getOutOfStockProducts = async (): Promise<Product[]> => {
  return products.filter(product => product.stock === 0);
};
