
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, getCategories } from "@/services/productService";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Star, Truck, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedForYou, setRecommendedForYou] = useState<Product[]>([]);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=2069&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=2070&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598971639058-bb4741c32139?w=1974&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?w=2070&auto=format&fit=crop&q=80"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allCategories = await getCategories();
        const allProducts = await getAllProducts();
        
        setCategories(allCategories);
        
        // Get featured products (electronics)
        const electronics = allProducts.filter(p => p.category === 'Electronics');
        setFeaturedProducts(electronics.slice(0, 10));
        
        // Get new arrivals (fashion)
        const fashion = allProducts.filter(p => p.category === 'Fashion');
        setNewArrivals(fashion.slice(0, 10));
        
        // Get top rated products (Home & Kitchen)
        const homeProducts = allProducts.filter(p => p.category === 'Home & Kitchen');
        setTopRated(homeProducts.slice(0, 10));
        
        // Get recommended products (mix of categories)
        const recommended = [...allProducts].sort(() => 0.5 - Math.random());
        setRecommendedForYou(recommended.slice(0, 10));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const categoryIcons = [
    "📱", "👕", "🏠", "💄", "🔌", "🧸", "🛒", "💻", "📚", "🎮"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Main Hero Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="min-w-full">
                <img 
                  src={image} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-48 md:h-72 lg:h-96 object-cover object-center"
                />
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full dark:bg-black/50 dark:hover:bg-black/70 dark:text-white transform transition-transform hover:scale-105"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full dark:bg-black/50 dark:hover:bg-black/70 dark:text-white transform transition-transform hover:scale-105"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-4" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="bg-white dark:bg-gray-800 py-6 px-4 mb-4 shadow-md">
          <div className="container mx-auto">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {categories.slice(0, 10).map((category, index) => (
                <Link
                  key={category}
                  to={`/products?category=${category.toLowerCase()}`}
                  className="flipkart-category-item text-center transform hover:scale-110 transition-transform dark:text-gray-200"
                >
                  <span className="text-2xl mb-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-full inline-block">{categoryIcons[index % categoryIcons.length]}</span>
                  <span className="text-xs md:text-sm font-medium mt-2">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Why Shop With Us Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 mb-8 shadow-md">
            <h2 className="text-xl font-bold mb-6 text-center">Why Shop With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                <Truck className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">On all orders above ₹499</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                <ShieldCheck className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-medium">Secure Payments</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">100% secure payment</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                <Clock className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-medium">Easy Returns</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">10 day return policy</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                <Star className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-medium">24/7 Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Dedicated support</p>
              </div>
            </div>
          </div>

          {/* Deals of the Day */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Deals of the Day</h2>
                <p className="text-gray-500 dark:text-gray-400">Top electronics with great discounts</p>
              </div>
              <Link to="/products?category=electronics">
                <Button 
                  variant="ghost" 
                  className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {featuredProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
          
          {/* New Arrivals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">New Arrivals</h2>
                <p className="text-gray-500 dark:text-gray-400">Latest fashion items just for you</p>
              </div>
              <Link to="/products?category=fashion">
                <Button 
                  variant="ghost" 
                  className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {newArrivals.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
          
          {/* Top Rated Home Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Home & Kitchen Essentials</h2>
                <p className="text-gray-500 dark:text-gray-400">Top-rated products to enhance your living space</p>
              </div>
              <Link to="/products?category=home & kitchen">
                <Button 
                  variant="ghost" 
                  className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topRated.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
          
          {/* Featured Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/products?category=beauty" className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80" 
                    alt="Beauty Products" 
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">Beauty Products</h3>
                    <p className="text-white/80 mb-4">Save up to 40% on premium beauty brands</p>
                    <Button className="w-max bg-white text-black hover:bg-white/90">Shop Now</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/products?category=sports & fitness" className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=80" 
                    alt="Sports & Fitness" 
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">Sports & Fitness</h3>
                    <p className="text-white/80 mb-4">Get fit with our sports equipment collection</p>
                    <Button className="w-max bg-white text-black hover:bg-white/90">Shop Now</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* Recommended For You */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recommended For You</h2>
                <p className="text-gray-500 dark:text-gray-400">Based on your browsing history</p>
              </div>
              <Link to="/products">
                <Button 
                  variant="ghost" 
                  className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {recommendedForYou.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
