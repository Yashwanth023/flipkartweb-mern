
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { getProductById } from "@/services/productService";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Get favorite IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
        
        // Fetch product details for each favorite
        const favoriteProducts = await Promise.all(
          favoriteIds.map((id: string) => getProductById(id))
        );
        
        // Filter out any null results (in case a product was removed)
        setFavorites(favoriteProducts.filter(Boolean));
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast({
          title: "Error",
          description: "Failed to load your favorite items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [toast]);

  const removeFromFavorites = (productId: string) => {
    try {
      // Get current favorites
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      // Remove the product ID
      const updatedFavorites = favoriteIds.filter((id: string) => id !== productId);
      
      // Update localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      
      // Update state
      setFavorites(favorites.filter(product => product.id !== productId));
      
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites",
      });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from favorites",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="text-accent" />
              <span>My Favorites</span>
            </h1>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your favorites list is empty</h2>
              <p className="text-gray-500 mb-6">Add items to your favorites to keep track of products you love</p>
              <Link to="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="product-card card-hover group">
                  <div className="relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg" 
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        size="icon" 
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromFavorites(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                    
                    <div className="mt-3 text-sm">
                      <span className={product.stock > 0 ? "text-success" : "text-destructive"}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
