
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orderService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, getSubtotal, getGST, getDiscountAmount, getTotal, coupon, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: "",
    state: "",
    postalCode: "",
    phone: user?.mobile || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const requiredFields = ["name", "address", "city", "state", "postalCode", "phone"];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Missing information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check stock availability one more time
      for (const item of items) {
        if (item.quantity > item.product.stock) {
          toast({
            title: "Stock unavailable",
            description: `Only ${item.product.stock} units of ${item.product.name} are available`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Process the order
      if (user?.id) {
        const order = await createOrder(
          user.id,
          items,
          getSubtotal(),
          getGST(),
          getDiscountAmount(),
          coupon?.code
        );

        // Clear the cart after successful order
        clearCart();

        // Show success message
        toast({
          title: "Order placed successfully!",
          description: `Your order #${order.id} has been placed`,
        });

        // Redirect to order confirmation page
        navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-50">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                      Credit/Debit Card (Coming Soon)
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-50">
                    <RadioGroupItem value="upi" id="upi" disabled />
                    <Label htmlFor="upi" className="flex-1 cursor-not-allowed">
                      UPI (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Mobile View Order Summary */}
              <div className="lg:hidden bg-white rounded-lg border p-6 space-y-4">
                <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
                
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
                      <span>Discount ({coupon.discountPercentage}%)</span>
                      <span>-₹{getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="lg:w-1/3 hidden lg:block">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Details */}
              <div className="space-y-2 border-t pt-4">
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
                    <span>Discount ({coupon.discountPercentage}%)</span>
                    <span>-₹{getDiscountAmount().toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
              </div>
              
              {/* Checkout Button - Desktop */}
              <Button 
                onClick={handleSubmit}
                className="w-full mt-6" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
