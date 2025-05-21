import { Route, Routes } from "react-router-dom";

import RegisterForm from "@/pages/auth/registerUser";
import LoginForm from "@/pages/auth/loginUser";
import ChatPage from "@/pages/chat";

function App() {
  return (
    <Routes>
      <Route element={<RegisterForm />} path="/register" />
      <Route element={<LoginForm />} path="/login" />
      <Route element={<ChatPage />} path="/chat" />
    </Routes>
  );
}

export default App;
