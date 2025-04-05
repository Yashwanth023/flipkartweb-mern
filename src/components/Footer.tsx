
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube, Linkedin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Newsletter Subscription */}
        <div className="border-b border-gray-800 pb-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest offers, new arrivals, and exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img src="/logo.svg" alt="FlipKart Logo" className="w-6 h-6 mr-2" />
              FlipKart
            </h3>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for all your shopping needs. Quality products, amazing prices.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/favorites" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <span className="mr-1">•</span> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Shopping Avenue, Retail District, City, 12345
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">support@flipkart.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">Mon-Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-8 pt-8 mb-4">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">Visa</div>
            <div className="bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">Mastercard</div>
            <div className="bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">PayPal</div>
            <div className="bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">Apple Pay</div>
            <div className="bg-gray-800 rounded px-4 py-2 text-sm text-gray-400">Google Pay</div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-sm text-gray-500 text-center">
          <p>© {new Date().getFullYear()} FlipKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
