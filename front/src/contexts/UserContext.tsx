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

  const login = async (email: string, password: string): Promise<void> => {
    // try {
    //   const res = await fetch('/api/login', {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!res.ok) throw new Error('Login échoué');

    //   const data = await res.json();
    //   setUser(data.user);
    //   setToken(data.token);
    //   setIsAuthenticated(true);
    //   localStorage.setItem('token', data.token);
    // } catch (error) {
    //   console.error('Erreur login:', error);
    //   throw error;
    // }
  };

  const register = async (email: string, password: string, firstname?: string, lastname?: string, phoneNumber?: string, title?: string, societyName?: string, isDriver?: boolean, driverFirstname?: string, driverLastname?: string, driverPhoneNumber?: string): Promise<void> => {
    try {
      const res = await fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/ld+json' },
        body: JSON.stringify({ email, plainPassword: password, firstname, lastname, phoneNumber, title, societyName, isDriver, driverFirstname, driverLastname, driverPhoneNumber }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        if (errorData.violations && Array.isArray(errorData.violations)) {
          const violation = errorData.violations.find(v => v.propertyPath === "email");
          if (violation) {
            throw new Error(violation.message);
          }
        }

        throw new Error('Échec de l’inscription');
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data));

      const loginRes = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) throw new Error('Échec de l’authentification post-inscription');

      const loginData = await loginRes.json();

      setUser(data);
      setToken(loginData.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', loginData.token);
    } catch (error) {
      throw error;
    }
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
