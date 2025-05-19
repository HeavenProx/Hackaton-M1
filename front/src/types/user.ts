// Define types for user information
export type User = {
  userId: string;
  username: string;
  email: string;
  name: string;
  avatar: string;
  roles: string[];
  permissions: string[];
  theme: "light" | "dark";
  language: string;
};

// Define the context type
export type UserContextType = {
  // User information
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Functions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
};
