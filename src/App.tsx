import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Inicio from "./Pages/Inicio";
import Catalogo from "./Pages/Catalogo";
import Servicios from "./Pages/Servicios";
import Nosotros from "./Pages/Nosotros";
import Perfil from "./Pages/Perfil";
import AuthCallback from "./Pages/AuthCallback";
import Pago from "./Pages/Pago";
import PagoYape from "./Pages/PagoYape";
import PagoExitosoYape from "./Pages/PagoExitosoYape";
import PagoExitoso from "./Pages/PagoExitoso";
import Registro from "./Pages/Registro";
import PagoStripe from "./Pages/PagoStripe";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsuarios from "./Pages/AdminUsuarios";
import AdminProductos from "./Pages/AdminProductos";
import AdminCompras from "./Pages/AdminCompras";
import AdminInventario from "./Pages/AdminInventario";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter
        basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}
      >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/pago-yape" element={<PagoYape />} />
        <Route path="/pago-exitoso-yape" element={<PagoExitosoYape />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pago-stripe" element={<PagoStripe />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/compras" element={<AdminCompras />} />
        <Route path="/admin/inventario" element={<AdminInventario />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;