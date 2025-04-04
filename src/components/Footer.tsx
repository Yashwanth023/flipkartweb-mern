
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">VibrantCart</h3>
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  123 Shopping Avenue, Retail District, City, 12345
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-400">support@vibrantcart.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          <p>© {new Date().getFullYear()} VibrantCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
