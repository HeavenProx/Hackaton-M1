import { Navigate } from "react-router-dom";

import { useUser } from "@/contexts/UserContext";

export const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/" /> : children;
};
