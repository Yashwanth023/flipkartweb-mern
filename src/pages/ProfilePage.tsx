
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserCircle, Package, LogOut, AlertTriangle } from "lucide-react";

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    mobile: user?.mobile || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-500 mb-8">
              Please log in to view your profile.
            </p>
            <Link to="/login?redirect=profile">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    // In a real app, this would send an API request to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user.name,
      email: user.email || "",
      address: user.address,
      mobile: user.mobile,
      dateOfBirth: user.dateOfBirth || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg border p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <UserCircle className="h-20 w-20 text-gray-400" />
                <h2 className="text-xl font-medium mt-2">{user.name}</h2>
                <p className="text-gray-500">{user.mobile}</p>
              </div>
              
              <div className="space-y-2">
                <Link to="/profile">
                  <Button variant="ghost" className="w-full justify-start">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
                      {user.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  {isEditing ? (
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
                      {user.mobile}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
                      {user.email || "Not provided"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
                      {user.dateOfBirth || "Not provided"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-gray-700 p-2 border rounded-md bg-gray-50">
                      {user.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
