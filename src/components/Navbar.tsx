
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Search,
  Menu,
  X,
  Heart,
  Home,
  ShoppingBag,
  Phone,
  Info
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-white to-brand-50 shadow-md py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="VibrantCart Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold gradient-text">VibrantCart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="nav-item flex items-center gap-1">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/products" className="nav-item flex items-center gap-1">
            <ShoppingBag size={16} />
            <span>Products</span>
          </Link>
          <Link to="/about" className="nav-item flex items-center gap-1">
            <Info size={16} />
            <span>About</span>
          </Link>
          <Link to="/contact" className="nav-item flex items-center gap-1">
            <Phone size={16} />
            <span>Contact</span>
          </Link>
        </div>

        {/* Search Form - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white/80 pr-10 border-primary/20 focus-visible:ring-primary"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-0 rounded-full"
          >
            <Search size={18} className="text-primary" />
          </Button>
        </form>

        {/* Auth and Cart Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="relative rounded-full bg-white/80 border border-primary/10 hover:bg-primary/10">
                  <Heart className="h-5 w-5 text-accent-500" />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full bg-white/80 border border-primary/10 hover:bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-bold">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.mobile}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="flex w-full items-center">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin" className="flex w-full items-center">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative rounded-full bg-white/80 border border-primary/10 hover:bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  {getCartCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                      {getCartCount()}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="rounded-full border-primary hover:bg-primary/10 hover:text-primary">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isAuthenticated && (
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="rounded-full">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg animate-fade-in mt-4 rounded-lg">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full pr-10"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0 rounded-full"
            >
              <Search size={18} />
            </Button>
          </form>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={18} />
              <span>Products</span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info size={18} />
              <span>About</span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              <span>Contact</span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package size={18} />
                  <span>Orders</span>
                </Link>
                <Link 
                  to="/favorites" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} />
                  <span>Favorites</span>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-red-600 hover:text-red-800 py-2 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
