
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, getCategories } from "@/services/productService";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598971639058-bb4741c32139?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=2069&auto=format&fit=crop"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allCategories = await getCategories();
        const allProducts = await getAllProducts();
        
        setCategories(allCategories);
        
        // Get featured products (first 10)
        setFeaturedProducts(allProducts.slice(0, 10));
        
        // Get new arrivals (randomize for demo)
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        setNewArrivals(shuffled.slice(0, 10));
        
        // Get top rated products (another random subset for demo)
        const shuffledAgain = [...allProducts].sort(() => 0.5 - Math.random());
        setTopRated(shuffledAgain.slice(0, 10));
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full dark:bg-black/50 dark:hover:bg-black/70 dark:text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full dark:bg-black/50 dark:hover:bg-black/70 dark:text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="bg-white py-4 px-4 mb-2 shadow-sm dark:bg-gray-800">
          <div className="container mx-auto">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {categories.slice(0, 10).map((category, index) => (
                <Link
                  key={category}
                  to={`/products?category=${category.toLowerCase()}`}
                  className="flipkart-category-item text-center dark:text-gray-200"
                >
                  <span className="text-2xl mb-1">{categoryIcons[index % categoryIcons.length]}</span>
                  <span className="text-xs md:text-sm font-medium">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Deals of the Day */}
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white rounded-sm p-4 mb-4 dark:bg-gray-800 dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Deals of the Day</h2>
              <Link to="/products">
                <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300">
                  View All
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-sm mb-2 dark:bg-gray-700"></div>
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
          <div className="bg-white rounded-sm p-4 mb-4 dark:bg-gray-800 dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Arrivals</h2>
              <Link to="/products">
                <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300">
                  View All
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-sm mb-2 dark:bg-gray-700"></div>
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
          
          {/* Suggested for You */}
          <div className="bg-white rounded-sm p-4 dark:bg-gray-800 dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Suggested for You</h2>
              <Link to="/products">
                <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300">
                  View All
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-sm mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-1/2 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {topRated.slice(0, 10).map((product) => (
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
