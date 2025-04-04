
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, getCategories } from "@/services/productService";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag, Zap, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        const cats = await getCategories();
        
        // Get a slice of products as featured
        setFeaturedProducts(products.slice(0, 4));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-500 text-white py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop the Latest Trends</h1>
            <p className="text-lg mb-8 opacity-90">
              Discover premium products with free shipping and guaranteed satisfaction.
            </p>
            <Link to="/products">
              <Button className="bg-white text-brand-700 hover:bg-gray-100">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-brand-50 p-3 rounded-full mb-4">
                <ShoppingBag className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over ₹500</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-brand-50 p-3 rounded-full mb-4">
                <Tag className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Direct from manufacturers</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-brand-50 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Express shipping options</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-brand-50 p-3 rounded-full mb-4">
                <ShieldCheck className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Secure Payments</h3>
              <p className="text-gray-600">100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-md"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-video rounded-md"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 3).map((category) => (
                <Link 
                  key={category} 
                  to={`/products?category=${category}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-video bg-gray-200">
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity group-hover:bg-opacity-30">
                      <h3 className="text-white text-xl font-semibold">{category}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-accent py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="max-w-lg mx-auto mb-6">
            Subscribe to our newsletter for exclusive offers, new arrivals, and shopping tips.
          </p>
          <form className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none"
            />
            <Button className="bg-white text-accent hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
