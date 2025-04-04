
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Truck, Package, Clock } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-700 to-brand-500 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About VibrantCart</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We're on a mission to provide the best shopping experience with quality products at affordable prices.
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-lg mb-6">
                  VibrantCart was founded in 2022 with a simple idea: make quality products accessible to everyone at fair prices.
                </p>
                <p className="text-lg mb-6">
                  What started as a small online store has grown into a marketplace trusted by thousands of customers across the country.
                </p>
                <p className="text-lg">
                  Our team is passionate about curating the best products and providing exceptional customer service to ensure your shopping experience is nothing short of excellent.
                </p>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Our team" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 px-4 bg-muted">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                <p className="text-gray-600">
                  We prioritize our customers in every decision we make and strive to exceed expectations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                <p className="text-gray-600">
                  We carefully select and verify all products to ensure they meet our high standards.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Reliable Delivery</h3>
                <p className="text-gray-600">
                  We partner with trusted logistics providers to ensure your orders arrive safely and on time.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustainable Packaging</h3>
                <p className="text-gray-600">
                  We're committed to reducing our environmental footprint with eco-friendly packaging.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose VibrantCart</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-accent/10 rounded-full p-5">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    We understand the excitement of receiving a new purchase. That's why we offer expedited shipping options to get your orders to you as quickly as possible.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-accent/10 rounded-full p-5">
                  <ShieldCheck className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                  <p className="text-gray-600">
                    Your security is our priority. We implement the latest encryption technologies to ensure your personal and payment information is always protected.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-accent/10 rounded-full p-5">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                  <p className="text-gray-600">
                    Not completely satisfied? No problem. Our hassle-free return policy allows you to return products within 30 days for a full refund or exchange.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/products">
                <Button size="lg" className="rounded-full">Start Shopping</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
