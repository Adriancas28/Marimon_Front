import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      
      {/* Header Superior - Ahora ocupa todo el ancho */}
      <div className="bg-[#d42025] text-white py-6 px-12 flex justify-between items-center shadow-xl z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">PANEL DE CONTROL ADMINISTRATIVO</h1>
          <p className="text-red-100 text-xs font-bold uppercase tracking-[0.3em] mt-1">Marimon Perú - Gestión Centralizada</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col text-right">
             <span className="text-xs font-black uppercase opacity-70">Rol de Acceso</span>
             <span className="text-sm font-bold">Administrador Marimon</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 bg-white text-[#d42025] hover:bg-black hover:text-white transition-all px-8 py-3 rounded-full text-sm font-black shadow-lg"
          >
            <i className="bi bi-power text-lg"></i>
            SALIR DEL SISTEMA
          </button>
        </div>
      </div>

      {/* Contenido Principal - Expandido al 100% */}
      <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full">
          
          {/* Tarjeta de USUARIOS */}
          <Link to="/admin/usuarios" className="group h-full">
            <div className="bg-white h-full min-h-[400px] rounded-[40px] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-4 flex flex-col border border-gray-100">
              <div className="flex-1 flex justify-center items-center p-10 group-hover:bg-purple-50 transition-colors">
                <div className="w-40 h-40 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 transition-all duration-500 group-hover:scale-125 group-hover:bg-white group-hover:shadow-xl">
                  <i className="bi bi-people-fill text-7xl"></i>
                </div>
              </div>
              <div className="bg-[#1c1c1c] text-white py-8 px-4 text-center font-black tracking-[0.2em] text-lg">
                USUARIOS
              </div>
            </div>
          </Link>

          {/* Tarjeta de PRODUCTOS */}
          <Link to="/admin/productos" className="group h-full">
            <div className="bg-white h-full min-h-[400px] rounded-[40px] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-4 flex flex-col border border-gray-100">
              <div className="flex-1 flex justify-center items-center p-10 group-hover:bg-red-50 transition-colors">
                <div className="w-40 h-40 bg-red-50 rounded-full flex items-center justify-center text-[#d42025] transition-all duration-500 group-hover:scale-125 group-hover:bg-white group-hover:shadow-xl">
                  <i className="bi bi-box-fill text-7xl"></i>
                </div>
              </div>
              <div className="bg-[#1c1c1c] text-white py-8 px-4 text-center font-black tracking-[0.2em] text-lg">
                PRODUCTOS
              </div>
            </div>
          </Link>

          {/* Tarjeta de COMPRAS */}
          <Link to="/admin/compras" className="group h-full">
            <div className="bg-white h-full min-h-[400px] rounded-[40px] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-4 flex flex-col border border-gray-100">
              <div className="flex-1 flex justify-center items-center p-10 group-hover:bg-blue-50 transition-colors">
                <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 transition-all duration-500 group-hover:scale-125 group-hover:bg-white group-hover:shadow-xl">
                  <i className="bi bi-cart-check-fill text-7xl"></i>
                </div>
              </div>
              <div className="bg-[#1c1c1c] text-white py-8 px-4 text-center font-black tracking-[0.2em] text-lg">
                COMPRAS
              </div>
            </div>
          </Link>

          {/* Tarjeta de INVENTARIO */}
          <Link to="/admin/inventario" className="group h-full">
            <div className="bg-white h-full min-h-[400px] rounded-[40px] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-4 flex flex-col border border-gray-100">
              <div className="flex-1 flex justify-center items-center p-10 group-hover:bg-green-50 transition-colors">
                <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center text-green-600 transition-all duration-500 group-hover:scale-125 group-hover:bg-white group-hover:shadow-xl">
                  <i className="bi bi-arrow-down-up text-7xl"></i>
                </div>
              </div>
              <div className="bg-[#1c1c1c] text-white py-8 px-4 text-center font-black tracking-[0.2em] text-lg">
                INVENTARIO
              </div>
            </div>
          </Link>

        </div>
      </div>

      {/* Footer del Panel - También a todo el ancho */}
      <div className="bg-[#1c1c1c] py-6 px-12 flex justify-between items-center text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase">
          <span>MARIMON ERP SYSTEM v2.0</span>
          <span>&copy; 2026 GESTIÓN DE AUTOPARTES - ACCESO RESTRINGIDO</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
