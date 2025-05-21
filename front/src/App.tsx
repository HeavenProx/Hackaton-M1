import { Route, Routes } from "react-router-dom";

import { PrivateOnlyRoute } from "@/components/routes/PrivateOnlyRoute";
import { PublicOnlyRoute } from "@/components/routes/PublicOnlyRoute";

import RegisterForm from "@/pages/auth/registerUser";
import LoginForm from "@/pages/auth/loginUser";
import ChatPage from "@/pages/chat";
import { VehiclesPage } from "@/pages/vehicles";
import AddVehiclePage from "@/pages/add-vehicle";

function App() {
  return (
    <Routes>
      {/* Public only */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LoginForm />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterForm />
          </PublicOnlyRoute>
        }
      />

      {/* Private only */}
      <Route
        path="/chat"
        element={
          <PrivateOnlyRoute>
            <ChatPage />
          </PrivateOnlyRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <PrivateOnlyRoute>
            <VehiclesPage />
          </PrivateOnlyRoute>
        }
      />
      <Route
        path="/add-vehicle"
        element={
          <PrivateOnlyRoute>
            <AddVehiclePage />
          </PrivateOnlyRoute>
        }
      />
    </Routes>
  );
}

export default App;
