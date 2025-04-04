
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "@/services/productService";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchProducts(query);
        setProducts(results);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-500 mb-8">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-md"></div>
                <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-medium mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
