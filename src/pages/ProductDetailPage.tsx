
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "@/services/productService";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  ChevronLeft, 
  Plus, 
  Minus, 
  AlertTriangle,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <div className="bg-gray-200 aspect-square rounded-lg"></div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-24 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded mb-6"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="text-gray-500 hover:text-brand-600 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-sm text-gray-500 mb-4">
              Category: {product.category}
            </div>

            <div className="text-2xl font-semibold mb-6">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="text-green-600 flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-600 mr-2"></div>
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center mb-6">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full mb-6"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            {/* Product Benefits */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-brand-600 mr-3" />
                <span>Free delivery on orders over ₹500</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-brand-600 mr-3" />
                <span>1 year warranty on all products</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-brand-600 mr-3" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
