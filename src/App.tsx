import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Catalogo from "./Pages/Catalogo";
import AuthCallback from "./Pages/AuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;