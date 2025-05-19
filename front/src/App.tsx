import { Route, Routes } from "react-router-dom";

import MultiStepForm from "@/components/loginForm";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<MultiStepForm />} />

    </Routes>
  );
}

export default App;
