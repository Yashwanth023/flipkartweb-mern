
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { theme } = useTheme();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Calculate a fake discount price (15-30% off)
  const discountPercentage = Math.floor(Math.random() * 16) + 15; // 15-30%
  const originalPrice = Math.round(product.price / (1 - discountPercentage / 100));

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <Card className={`overflow-hidden h-full transition-all duration-300 hover:shadow-xl ${
        theme === 'dark' ? 'hover:border-primary/40 dark:hover:shadow-primary/20' : 'hover:border-primary/40 hover:shadow-primary/20'
      } transform hover:-translate-y-1`}>
        <CardContent className="p-3 h-full flex flex-col">
          {/* Product Image with Add to Wishlist */}
          <div className="relative mb-3 pt-2 flex-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <div className="overflow-hidden rounded-md w-full h-40 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-0 right-0 text-gray-400 hover:text-red-500 bg-transparent opacity-70 
                group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'dark:hover:bg-transparent' : ''}`}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col">
            {/* Name and Category */}
            <div className="mb-1">
              <h3 className="text-sm font-medium line-clamp-2 text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
            </div>

            {/* Price and Rating */}
            <div className="mt-auto">
              <div className="flex items-center">
                <span className="text-base font-medium flipkart-price">₹{product.price.toLocaleString()}</span>
                <span className="flipkart-original-price">₹{originalPrice.toLocaleString()}</span>
                <span className="flipkart-discount">{discountPercentage}% off</span>
              </div>

              {/* Stock Status */}
              {product.stock > 0 ? (
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddToCart}
                    className="text-xs py-1 h-7 bg-primary text-white hover:bg-primary/90 rounded-sm 
                      transform transition-transform hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ) : (
                <div className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium">Out of Stock</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
