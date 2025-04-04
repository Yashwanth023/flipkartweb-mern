
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(redirectPath === "login" ? "/" : `/${redirectPath}`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your mobile number and password",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await login(mobile, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect to the intended page or home
        navigate(redirectPath === "login" ? "/" : `/${redirectPath}`);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid mobile number or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Login to access your account and orders
            </p>
          </div>
          
          <div className="bg-white rounded-lg border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-brand-600 hover:text-brand-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to={`/register${location.search}`} 
                  className="text-brand-600 hover:text-brand-800 font-medium"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              For testing, use these credentials:
            </p>
            <p>
              Admin: 9876543210 / Admin@123
            </p>
            <p>
              Customer: 1234567890 / User@123
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
