import { Car } from "@/types/car";

// Define types for user information
export type User = {
  "@id": string;
  username: string;
  password: string,
  firstname?: string,
  lastname?: string,
  phoneNumber?: string,
  title?: string,
  societyName?: string,
  isDriver?: boolean,
  driverFirstname?: string,
  driverLastname?: string,
  driverPhoneNumber?: string,
  cars: Car[];
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
  register: (
    email: string,
    password: string,
    firstname?: string,
    lastname?: string,
    phoneNumber?: string,
    title?: string,
    societyName?: string,
    isDriver?: boolean,
    driverFirstname?: string,
    driverLastname?: string,
    driverPhoneNumber?: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
};
