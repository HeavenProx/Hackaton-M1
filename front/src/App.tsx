import { Route, Routes } from "react-router-dom";

import RegisterForm from "@/pages/auth/registerUser";
import LoginForm from "@/pages/auth/loginUser";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />

    </Routes>
  );
}

export default App;
