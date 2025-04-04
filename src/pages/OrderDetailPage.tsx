
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const orderData = await getOrderById(id);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error fetching order",
          description: "There was a problem loading your order details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return "default";
      case OrderStatus.PACKED:
        return "secondary";
      case OrderStatus.SHIPPING:
        return "default";
      case OrderStatus.DELIVERED:
        return "secondary";
      case OrderStatus.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-500 mb-8">
              Please log in to view order details.
            </p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-500 mb-8">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/orders">
              <Button>Back to Orders</Button>
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
            to="/orders" 
            className="text-gray-500 hover:text-brand-600 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <Badge variant={getStatusBadgeVariant(order.status)} className="text-base py-1 px-3">
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div 
                    key={item.product.id} 
                    className="flex items-center border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link 
                        to={`/products/${item.product.id}`}
                        className="font-medium hover:text-brand-600"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{item.product.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
              
              <div className="relative">
                <div className="absolute top-0 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
                
                <ul className="space-y-6">
                  <li className="relative pb-6">
                    <div className="flex items-center">
                      <div className="absolute left-0 h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center">
                        <span className="text-white text-sm">1</span>
                      </div>
                      <div className="ml-12">
                        <h3 className="font-medium">Order Placed</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="relative pb-6">
                    <div className="flex items-center">
                      <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${order.status !== OrderStatus.PLACED ? 'bg-brand-600' : 'bg-gray-300'}`}>
                        <span className="text-sm text-white">2</span>
                      </div>
                      <div className="ml-12">
                        <h3 className={`font-medium ${order.status === OrderStatus.CANCELLED ? 'text-gray-400' : ''}`}>
                          Order Packed
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.CANCELLED 
                            ? 'Cancelled'
                            : order.status !== OrderStatus.PLACED 
                              ? 'Your order has been packed and is ready for shipping' 
                              : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="relative pb-6">
                    <div className="flex items-center">
                      <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${order.status === OrderStatus.SHIPPING || order.status === OrderStatus.DELIVERED ? 'bg-brand-600' : 'bg-gray-300'}`}>
                        <span className="text-sm text-white">3</span>
                      </div>
                      <div className="ml-12">
                        <h3 className={`font-medium ${order.status === OrderStatus.CANCELLED ? 'text-gray-400' : ''}`}>
                          In Transit
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.CANCELLED 
                            ? 'Cancelled'
                            : order.status === OrderStatus.SHIPPING || order.status === OrderStatus.DELIVERED 
                              ? 'Your order is on its way to you' 
                              : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="relative">
                    <div className="flex items-center">
                      <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${order.status === OrderStatus.DELIVERED ? 'bg-brand-600' : 'bg-gray-300'}`}>
                        <span className="text-sm text-white">4</span>
                      </div>
                      <div className="ml-12">
                        <h3 className={`font-medium ${order.status === OrderStatus.CANCELLED ? 'text-gray-400' : ''}`}>
                          Delivered
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.status === OrderStatus.CANCELLED 
                            ? 'Cancelled'
                            : order.status === OrderStatus.DELIVERED 
                              ? 'Your order has been delivered' 
                              : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                
                <div className="pt-2 border-t mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{order.gst.toLocaleString()}</span>
                  </div>
                  
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 block text-sm">Name</span>
                  <span>{user.name}</span>
                </div>
                
                <div>
                  <span className="text-gray-600 block text-sm">Phone</span>
                  <span>{user.mobile}</span>
                </div>
                
                {user.email && (
                  <div>
                    <span className="text-gray-600 block text-sm">Email</span>
                    <span>{user.email}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600 block text-sm">Shipping Address</span>
                  <span>{user.address}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;
