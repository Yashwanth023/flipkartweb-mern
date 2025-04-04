
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Trash, 
  Plus, 
  Minus, 
  ShoppingCart, 
  AlertTriangle,
  ChevronLeft,
  Tag
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal, 
    getGST, 
    getTotal, 
    getDiscountAmount,
    applyCoupon,
    removeCoupon,
    coupon 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      await applyCoupon(couponCode);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=checkout");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Waiting</h1>
            <p className="text-gray-500 mb-8">
              Please log in to view your cart and checkout.
            </p>
            <div className="space-y-4">
              <Link to="/login?redirect=cart">
                <Button className="w-full">Login</Button>
              </Link>
              <Link to="/register?redirect=cart">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to="/products" 
            className="text-gray-500 hover:text-brand-600 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/products/${item.product.id}`}
                          className="font-medium hover:text-brand-600"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {item.product.category}
                        </div>
                        {item.product.stock < item.quantity && (
                          <div className="text-sm text-red-600 flex items-center mt-1">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>Only {item.product.stock} available</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.product.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.product.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg border p-6 space-y-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Price Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>₹{getGST().toLocaleString()}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Discount ({coupon.discountPercentage}%)
                    </span>
                    <span>-₹{getDiscountAmount().toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
              </div>
              
              {/* Coupon Code */}
              {!coupon ? (
                <div className="pt-2">
                  <label className="block text-sm mb-2">Apply Coupon Code</label>
                  <div className="flex space-x-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-md p-3 flex justify-between items-center">
                  <div>
                    <span className="text-green-800 font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {coupon.code}
                    </span>
                    <span className="text-sm text-green-600">{coupon.discountPercentage}% discount applied</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeCoupon}
                    className="h-8 text-sm text-green-700 hover:text-green-900 hover:bg-green-100"
                  >
                    Remove
                  </Button>
                </div>
              )}
              
              {/* Checkout Button */}
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              
              {/* Secure Checkout Notice */}
              <div className="text-center text-sm text-gray-500">
                <p>Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
