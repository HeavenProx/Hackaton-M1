import { Route, Routes } from "react-router-dom";

import { PrivateOnlyRoute } from "@/components/routes/PrivateOnlyRoute";
import { PublicOnlyRoute } from "@/components/routes/PublicOnlyRoute";
import RegisterForm from "@/pages/auth/register";
import LoginForm from "@/pages/auth/login";
import ChatPage from "@/pages/chat";
import { VehiclesPage } from "@/pages/vehicles";
import AddVehiclePage from "@/pages/add-vehicle";

function App() {
  return (
    <Routes>
      {/* Public only */}
      <Route
        element={
          <PublicOnlyRoute>
            <LoginForm />
          </PublicOnlyRoute>
        }
        path="/login"
      />
      <Route
        element={
          <RegisterForm />
        }
        path="/register"
      />

      {/* Private only */}
      <Route
        element={
          <PrivateOnlyRoute>
            <ChatPage />
          </PrivateOnlyRoute>
        }
        path="/"
      />
      <Route
        element={
          <PrivateOnlyRoute>
            <VehiclesPage />
          </PrivateOnlyRoute>
        }
        path="/vehicles"
      />
      <Route
        element={
          <PrivateOnlyRoute>
            <AddVehiclePage />
          </PrivateOnlyRoute>
        }
        path="/add-vehicle"
      />
    </Routes>
  );
}

export default App;
