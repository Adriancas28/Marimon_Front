import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Inicio from "./Pages/Inicio";
import Catalogo from "./Pages/Catalogo";
import Servicios from "./Pages/Servicios";
import Nosotros from "./Pages/Nosotros";
import Perfil from "./Pages/Perfil";
import AuthCallback from "./Pages/AuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;