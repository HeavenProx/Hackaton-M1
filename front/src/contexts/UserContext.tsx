import { createContext, useState, useContext, ReactNode } from "react";

import { User, UserContextType } from "@/types/user";

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Login function (empty implementation as requested)
  const login = async (email: string, password: string): Promise<void> => {
    // Implementation will go here
  };

  // Register function to create a new account
  const register = async (username: string, email: string, password: string): Promise<void> => {
    // Implementation will go here
    // This function should handle the registration process
    // and might involve API calls to create a new user account
  };

  // Logout function (empty implementation as requested)
  const logout = () => {
    // Implementation will go here
  };

  // Update user function (empty implementation as requested)
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    // Implementation will go here
  };

  // Value object that will be provided to consumers
  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for using the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
