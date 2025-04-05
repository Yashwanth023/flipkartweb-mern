import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { getAllProducts, updateProduct, deleteProduct } from "@/services/productService";
import { getAllCoupons, toggleCouponStatus } from "@/services/couponService";
import { getDashboardMetrics } from "@/services/dashboardService";
import { DashboardMetrics, UserRole, OrderStatus, Order, Product, Coupon } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  ShoppingBag, 
  Package, 
  Tag, 
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

// Dashboard tab for metrics and analytics
const DashboardTab = ({ metrics }: { metrics: DashboardMetrics }) => {
  // Transform the order status counts for the pie chart
  const orderStatusData = Object.entries(metrics.orderStatusCounts).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sales</CardDescription>
            <CardTitle className="text-3xl">
              ₹{metrics.sales.totalSales.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              {metrics.sales.orderCount} orders
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Order Value</CardDescription>
            <CardTitle className="text-3xl">
              ₹{metrics.sales.averageOrderValue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Per order
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low Stock Items</CardDescription>
            <CardTitle className="text-3xl">
              {metrics.inventory.lowStockProducts.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Out of {metrics.inventory.totalProducts} products
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Coupons</CardDescription>
            <CardTitle className="text-3xl">
              {metrics.coupons.activeCoupons}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500">
              Used {metrics.coupons.totalCouponsUsed} times
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.recentOrders.map(order => ({
                    name: order.id.substring(0, 8),
                    total: order.totalAmount
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === OrderStatus.CANCELLED
                          ? "destructive"
                          : (order.status as OrderStatus) === OrderStatus.DELIVERED
                          ? "secondary"
                          : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell className="text-right">
                    ₹{order.totalAmount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Products tab for product management
const ProductsTab = ({ 
  products, 
  onUpdateProduct, 
  onDeleteProduct 
}: { 
  products: Product[];
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Link to="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {product.stock <= 5 ? (
                      <span className="text-orange-600">{product.stock}</span>
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Orders tab for order management
const OrdersTab = ({ 
  orders, 
  onUpdateOrderStatus 
}: { 
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}) => {
  const getStatusOptions = (currentStatus: OrderStatus) => {
    const allStatuses = Object.values(OrderStatus);
    
    // If the order is cancelled or delivered, don't allow status change
    if (currentStatus === OrderStatus.CANCELLED || (currentStatus as OrderStatus) === OrderStatus.DELIVERED) {
      return [];
    }
    
    // Find the index of the current status
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // Return all statuses except the current one and cancelled if already delivered
    return allStatuses.filter((status) => {
      if (status === currentStatus) return false;
      if (status === OrderStatus.CANCELLED && currentStatus === OrderStatus.DELIVERED) return false;
      return true;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Management</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
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
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === OrderStatus.CANCELLED
                          ? "destructive"
                          : (order.status as OrderStatus) === OrderStatus.DELIVERED
                          ? "secondary"
                          : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Show status change options */}
                      {getStatusOptions(order.status).length > 0 && (
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          onChange={(e) => 
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Change Status
                          </option>
                          {getStatusOptions(order.status).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}

                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Coupons tab for coupon management
const CouponsTab = ({ 
  coupons, 
  onToggleStatus 
}: { 
  coupons: Coupon[];
  onToggleStatus: (id: string) => Promise<void>;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupon Management</h2>
        <Link to="/admin/coupons/new">
          <Button>Add New Coupon</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Cart Value</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.discountPercentage}%</TableCell>
                  <TableCell>₹{coupon.minimumCartValue.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.isActive ? "secondary" : "outline"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onToggleStatus(coupon.id)}
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Link to={`/admin/coupons/${coupon.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all necessary data
  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch orders first as they're needed for metrics
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        
        // Fetch products and coupons
        const [productsData, couponsData, metricsData] = await Promise.all([
          getAllProducts(),
          getAllCoupons(),
          getDashboardMetrics(ordersData)
        ]);
        
        setProducts(productsData);
        setCoupons(couponsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate]);

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      if (updatedOrder) {
        // Update orders state
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle product update
  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(productId, updates);
      if (updatedProduct) {
        // Update products state
        setProducts(products.map(product => 
          product.id === productId ? updatedProduct : product
        ));
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    try {
      const success = await deleteProduct(productId);
      if (success) {
        // Update products state
        setProducts(products.filter(product => product.id !== productId));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle coupon status toggle
  const handleToggleCouponStatus = async (couponId: string) => {
    try {
      const updatedCoupon = await toggleCouponStatus(couponId);
      if (updatedCoupon) {
        // Update coupons state
        setCoupons(coupons.map(coupon => 
          coupon.id === couponId ? updatedCoupon : coupon
        ));
      }
    } catch (error) {
      console.error("Error toggling coupon status:", error);
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
              Please log in to access the admin dashboard.
            </p>
            <Link to="/login?redirect=admin">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-500 mb-8">
              You do not have permission to access the admin dashboard.
            </p>
            <Link to="/">
              <Button>Go to Homepage</Button>
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Manage your store, products, orders, and coupons
          </p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8">
              <TabsTrigger value="dashboard" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                <span>Coupons</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              {metrics && <DashboardTab metrics={metrics} />}
            </TabsContent>
            
            <TabsContent value="products">
              <ProductsTab 
                products={products} 
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrdersTab 
                orders={orders} 
                onUpdateOrderStatus={handleUpdateOrderStatus} 
              />
            </TabsContent>
            
            <TabsContent value="coupons">
              <CouponsTab 
                coupons={coupons} 
                onToggleStatus={handleToggleCouponStatus} 
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
