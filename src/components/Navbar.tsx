import { Link, useNavigate } from "react-router-dom";
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
  Plus,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const categories = [
    "Electronics", "Fashion", "Home", "Beauty", "Appliances", "Toys", "Grocery"
  ];

  return (
    <div className="sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="bg-primary text-white py-2 px-4 md:py-3 md:px-8 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="flex flex-row items-center justify-between">
            {/* Logo and Search - Desktop */}
            <div className="flex items-center flex-1 space-x-4">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src="/logo.svg" alt="FlipKart Logo" className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold mr-2">FlipKart</span>
                <span className="text-xs italic text-yellow-300">Explore <span className="text-secondary">Plus</span></span>
              </Link>

              {/* Search - Desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-3xl">
                <div className="relative flex w-full">
                  <Input
                    type="text"
                    placeholder="Search for products, brands and more"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-l-sm rounded-r-none bg-white text-black py-2 px-4 border-none focus-visible:ring-0 dark:bg-gray-800 dark:text-white"
                  />
                  <Button 
                    type="submit" 
                    className="rounded-l-none rounded-r-sm bg-secondary hover:bg-secondary/90 px-4 h-full"
                  >
                    <Search size={20} />
                  </Button>
                </div>
              </form>
            </div>

            {/* Auth and Cart Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-white hover:bg-transparent hover:text-white/90"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              {isAuthenticated ? (
                // ... keep existing code (authenticated user dropdown menu)
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white py-1 px-2 flex items-center space-x-1 hover:bg-transparent hover:text-white/90">
                        <User className="h-5 w-5" />
                        <span>{user?.name.split(' ')[0]}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
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
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/orders" className="flex w-full items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/favorites" className="flex w-full items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Wishlist</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link to="/admin" className="flex w-full items-center">
                              <Plus className="mr-2 h-4 w-4" />
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
                  
                  <Link to="/cart" className="flex items-center space-x-1 text-white hover:text-white/90">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {getCartCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-secondary">
                          {getCartCount()}
                        </Badge>
                      )}
                    </div>
                    <span>Cart</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-white bg-white/10 hover:bg-white/20 px-8">Login</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Theme Toggle for Mobile */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-white hover:bg-transparent hover:text-white/90"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              
              {isAuthenticated && (
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-transparent hover:text-white/90">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-secondary">
                        {getCartCount()}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-transparent hover:text-white/90">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search - Mobile */}
      <div className="md:hidden bg-primary px-4 pb-2 dark:bg-gray-900">
        <form onSubmit={handleSearch}>
          <div className="relative flex w-full">
            <Input
              type="text"
              placeholder="Search products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm bg-white text-black py-2 px-4 border-none focus-visible:ring-0 dark:bg-gray-800 dark:text-white"
            />
            <Button 
              type="submit" 
              className="absolute right-0 top-0 bottom-0 rounded-l-none rounded-r-sm bg-secondary px-4"
            >
              <Search size={18} />
            </Button>
          </div>
        </form>
      </div>

      {/* Categories Bar */}
      <div className="bg-white shadow-sm py-2 px-4 overflow-x-auto hidden md:block dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="flex space-x-10 justify-between">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category.toLowerCase()}`}
                className="flipkart-category-item whitespace-nowrap dark:text-gray-200"
              >
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 shadow-lg dark:bg-gray-800">
          <div className="flex flex-col space-y-3">
            {categories.map((category) => (
              <Link 
                key={category}
                to={`/products?category=${category.toLowerCase()}`} 
                className="text-gray-700 hover:text-primary py-2 transition-colors dark:text-gray-200 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            
            <div className="h-px bg-gray-200 my-2 dark:bg-gray-700"></div>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2 dark:text-gray-200 dark:hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2 dark:text-gray-200 dark:hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </Link>
                <Link 
                  to="/favorites" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2 dark:text-gray-200 dark:hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} />
                  <span>Wishlist</span>
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary py-2 transition-colors flex items-center gap-2 dark:text-gray-200 dark:hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-red-600 hover:text-red-800 py-2 transition-colors flex items-center gap-2 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-primary font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary py-2 transition-colors dark:text-gray-200 dark:hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
