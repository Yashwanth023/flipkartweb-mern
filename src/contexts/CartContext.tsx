
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product, Coupon } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  coupon: Coupon | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getSubtotal: () => number;
  getGST: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

// Mock coupons for demonstration
const mockCoupons: Coupon[] = [
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCoupon = localStorage.getItem("coupon");
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    
    if (savedCoupon) {
      setCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Save coupon to localStorage whenever it changes
  useEffect(() => {
    if (coupon) {
      localStorage.setItem("coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("coupon");
    }
  }, [coupon]);

  const addToCart = (product: Product, quantity: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    if (product.stock < quantity) {
      toast({
        title: "Not enough stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      });
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const newItems = [...prevItems];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast({
            title: "Not enough stock",
            description: `Cannot add more. Only ${product.stock} items available`,
            variant: "destructive",
          });
          return prevItems;
        }
        
        newItems[existingItemIndex].quantity = newQuantity;
        return newItems;
      } else {
        // Add new item to cart
        return [...prevItems, { product, quantity }];
      }
    });

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          // Check stock
          if (quantity > item.product.stock) {
            toast({
              title: "Not enough stock",
              description: `Only ${item.product.stock} items available`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getGST = () => {
    return getSubtotal() * 0.18; // 18% GST
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    
    const subtotal = getSubtotal();
    if (subtotal < coupon.minimumCartValue) return 0;
    
    return subtotal * (coupon.discountPercentage / 100);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const gst = getGST();
    const discount = getDiscountAmount();
    
    return subtotal + gst - discount;
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundCoupon = mockCoupons.find(
      (c) => c.code === code && c.isActive
    );

    if (!foundCoupon) {
      toast({
        title: "Invalid coupon",
        description: "This coupon code is invalid or expired",
        variant: "destructive",
      });
      return false;
    }

    const subtotal = getSubtotal();
    if (subtotal < foundCoupon.minimumCartValue) {
      toast({
        title: "Minimum amount not reached",
        description: `You need to spend at least ₹${foundCoupon.minimumCartValue} to use this coupon`,
        variant: "destructive",
      });
      return false;
    }

    // Check if coupon is still valid based on dates
    const now = new Date();
    const validFrom = new Date(foundCoupon.validFrom);
    const validUntil = new Date(foundCoupon.validUntil);
    
    if (now < validFrom || now > validUntil) {
      toast({
        title: "Expired coupon",
        description: "This coupon has expired or is not yet valid",
        variant: "destructive",
      });
      return false;
    }

    setCoupon(foundCoupon);
    toast({
      title: "Coupon applied",
      description: `${foundCoupon.discountPercentage}% discount applied to your order`,
    });
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getSubtotal,
        getGST,
        getDiscountAmount,
        getTotal,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
