
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Search,
  Menu,
  X
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
    <nav className="bg-white shadow-sm py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-brand-600">VibrantCart</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-brand-600 transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-brand-600 transition-colors">
            Products
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-600 transition-colors">
            Contact
          </Link>
        </div>

        {/* Search Form - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-0"
          >
            <Search size={18} />
          </Button>
        </form>

        {/* Auth and Cart Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="flex w-full">Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin" className="flex w-full">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
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
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isAuthenticated && (
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0"
            >
              <Search size={18} />
            </Button>
          </form>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-red-600 hover:text-red-800 py-2 transition-colors flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-200 my-2"></div>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-brand-600 py-2 transition-colors"
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
