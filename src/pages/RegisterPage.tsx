
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(redirectPath === "register" ? "/" : `/${redirectPath}`);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.mobile || !formData.address || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    // Validate mobile number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobile)) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return false;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return false;
    }

    // Confirm password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      const success = await register(userData);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created and you're now logged in",
        });
        
        // Redirect to the intended page or home
        navigate(redirectPath === "register" ? "/" : `/${redirectPath}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join VibrantCart to shop and track your orders
            </p>
          </div>
          
          <div className="bg-white rounded-lg border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your full address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Fields marked with <span className="text-red-500">*</span> are required</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link 
                  to={`/login${location.search}`} 
                  className="text-brand-600 hover:text-brand-800 font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
