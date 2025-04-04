
import { Product } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card group hover-scale">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>

          {product.stock <= 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary">Low Stock</Badge>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 truncate">{product.category}</p>
            <p className="mt-1 font-semibold text-lg">₹{product.price.toLocaleString()}</p>
          </div>
        </Link>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-full flex items-center justify-center gap-1"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
          <Link to={`/products/${product.id}`} className="w-full">
            <Button
              variant="outline"
              size="icon"
              className="w-full flex items-center justify-center gap-1"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View details</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
