
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/types";
import { getUserOrders, cancelOrder } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PackageOpen, ChevronRight, AlertTriangle } from "lucide-react";

const OrdersPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error fetching orders",
          description: "There was a problem loading your orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, toast]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const updatedOrder = await cancelOrder(orderId);
      if (updatedOrder) {
        // Update the local orders state
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        
        toast({
          title: "Order cancelled",
          description: "Your order has been cancelled successfully.",
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error cancelling order",
        description: "There was a problem cancelling your order.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED:
        return "default";
      case OrderStatus.PACKED:
        return "secondary";
      case OrderStatus.SHIPPING:
        return "default";
      case OrderStatus.DELIVERED:
        return "success";
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
              Please log in to view your orders.
            </p>
            <Link to="/login?redirect=orders">
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
          <h1 className="text-2xl font-bold mb-8">My Orders</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <PackageOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-gray-500 mb-8">
              You haven't placed any orders yet. Start shopping to place your first order.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
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
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>

        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {order.status === OrderStatus.PLACED && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              
              <p className="font-medium mb-3">₹{order.totalAmount.toLocaleString()}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </div>
                <div className="flex gap-2">
                  {order.status === OrderStatus.PLACED && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center">
                      Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
