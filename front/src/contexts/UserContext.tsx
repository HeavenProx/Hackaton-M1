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
    const res = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Email ou mot de passe incorrect');

    const data = await res.json();
    const token = data.token;

    const userRes = await fetch('http://127.0.0.1:8000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const user = await userRes.json();
    if (!user) throw new Error("Utilisateur non trouvé");

    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
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
