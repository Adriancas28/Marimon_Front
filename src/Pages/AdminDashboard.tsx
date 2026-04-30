import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Contenedor principal con max-width y sombra */}
      <div className="w-full max-w-[1750px] bg-white rounded-lg overflow-hidden shadow-lg">
        
        {/* Header rojo */}
        <div className="bg-[#d42025] text-white py-4 px-6 flex justify-between items-center">
          <h1 className="m-0 text-2xl font-semibold">Módulo de Administración</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-md text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Cerrar Sesión
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Tarjeta de USUARIOS */}
            <Link to="/admin/usuarios" className="block group">
              <div className="bg-white border-0 rounded-none overflow-hidden shadow-md transition-all duration-300 ease-in-out transform group-hover:-translate-y-1.5 group-hover:shadow-xl h-full flex flex-col">
                <div className="bg-gray-50 h-[220px] flex justify-center items-center p-4">
                  <div className="transition-transform duration-300 ease-in-out transform group-hover:scale-105 text-[#d42025]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[#1c1c1c] text-white py-4 px-4 text-center mt-auto">
                  <span className="font-semibold text-base tracking-wide">USUARIOS</span>
                </div>
              </div>
            </Link>

            {/* Tarjeta de PRODUCTOS */}
            <Link to="/admin/productos" className="block group">
              <div className="bg-white border-0 rounded-none overflow-hidden shadow-md transition-all duration-300 ease-in-out transform group-hover:-translate-y-1.5 group-hover:shadow-xl h-full flex flex-col">
                <div className="bg-gray-50 h-[220px] flex justify-center items-center p-4">
                  <div className="transition-transform duration-300 ease-in-out transform group-hover:scale-105 text-[#d42025]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[#1c1c1c] text-white py-4 px-4 text-center mt-auto">
                  <span className="font-semibold text-base tracking-wide">PRODUCTOS</span>
                </div>
              </div>
            </Link>

            {/* Tarjeta de COMPRAS */}
            <Link to="/admin/compras" className="block group">
              <div className="bg-white border-0 rounded-none overflow-hidden shadow-md transition-all duration-300 ease-in-out transform group-hover:-translate-y-1.5 group-hover:shadow-xl h-full flex flex-col">
                <div className="bg-gray-50 h-[220px] flex justify-center items-center p-4">
                  <div className="transition-transform duration-300 ease-in-out transform group-hover:scale-105 text-[#d42025]">
                     <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[#1c1c1c] text-white py-4 px-4 text-center mt-auto">
                  <span className="font-semibold text-base tracking-wide">COMPRAS</span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
