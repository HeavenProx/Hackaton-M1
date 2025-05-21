import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages";
import RegisterForm from "@/pages/auth/registerUser";
import LoginForm from "@/pages/auth/loginUser";
import ChatPage from "@/pages/chat";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<RegisterForm />} path="/register" />
      <Route element={<LoginForm />} path="/login" />
      <Route element={<ChatPage />} path="/chat" />
    </Routes>
  );
}

export default App;
