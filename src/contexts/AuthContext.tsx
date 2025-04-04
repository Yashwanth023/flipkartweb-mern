
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id" | "role">) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    mobile: "9876543210",
    address: "123 Admin Street",
    password: "Admin@123",
    role: UserRole.ADMIN,
  },
  {
    id: "2",
    name: "John Doe",
    mobile: "1234567890",
    address: "456 User Lane",
    email: "john@example.com",
    dateOfBirth: "1990-01-01",
    password: "User@123",
    role: UserRole.CUSTOMER,
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;

  const login = async (mobile: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(
      (u) => u.mobile === mobile && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, "id" | "role">): Promise<boolean> => {
    // In a real app, this would be an API call
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: UserRole.CUSTOMER,
    };
    
    // Add to mock data
    mockUsers.push(newUser);
    
    // Auto login after registration
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
