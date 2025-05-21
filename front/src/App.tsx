import { Route, Routes } from "react-router-dom";

import RegisterForm from "@/pages/auth/registerUser";
import LoginForm from "@/pages/auth/loginUser";
import ChatPage from "@/pages/chat";
import { VehiclesPage } from "@/pages/vehicles";
import AddVehiclePage from "@/pages/add-vehicle";

function App() {
  return (
    <Routes>
      <Route element={<RegisterForm />} path="/register" />
      <Route element={<LoginForm />} path="/" />
      <Route element={<ChatPage />} path="/chat" />
      <Route element={<VehiclesPage />} path="/vehicles" />
      <Route element={<AddVehiclePage />} path="/add-vehicle" />
    </Routes>
  );
}

export default App;
