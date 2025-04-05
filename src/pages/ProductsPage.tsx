
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCategories, searchProducts } from "@/services/productService";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Define the filterProducts function here to handle local filtering
  const filterProducts = (category?: string, minPrice?: number, maxPrice?: number) => {
    return products.filter(product => {
      // Apply category filter if specified
      if (category && product.category !== category) {
        return false;
      }
      
      // Apply price range filter
      if (minPrice !== undefined && product.price < minPrice) {
        return false;
      }
      
      if (maxPrice !== undefined && product.price > maxPrice) {
        return false;
      }
      
      return true;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const allProducts = await getAllProducts();
        const allCategories = await getCategories();
        
        setProducts(allProducts);
        setCategories(allCategories);
        
        // Initialize category from URL params
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }

        // Find min and max prices
        const prices = allProducts.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      try {
        let results: Product[] = [];
        
        if (query) {
          // Search by query
          results = await searchProducts(query);
        } else if (selectedCategory || priceRange[0] > 0 || priceRange[1] < 50000) {
          // Apply filters
          results = filterProducts(
            selectedCategory || undefined, 
            priceRange[0], 
            priceRange[1]
          );
        } else {
          // No filters, show all products
          results = [...products];
        }
        
        setFilteredProducts(results);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (products.length > 0) {
      applyFilters();
    }
  }, [query, selectedCategory, priceRange, products]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 50000]);
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {query ? `Search Results: "${query}"` : "All Products"}
          </h1>
          
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="w-full md:w-64 hidden md:block">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-8 text-sm"
                >
                  Clear
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_categories">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[priceRange[0], priceRange[1]]}
                      max={50000}
                      step={100}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceChange}
                      className="mb-6"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-1">₹</span>
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-24 h-8"
                      />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-1">₹</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                        className="w-24 h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter - Mobile */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_categories">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter - Mobile */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range
                    </label>
                    <div className="px-2">
                      <Slider
                        defaultValue={[priceRange[0], priceRange[1]]}
                        max={50000}
                        step={100}
                        value={[priceRange[0], priceRange[1]]}
                        onValueChange={handlePriceChange}
                        className="mb-6"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-1">₹</span>
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-24 h-8"
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-1">₹</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                          className="w-24 h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="w-1/2"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                    <Button 
                      className="w-1/2"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-md"></div>
                    <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
