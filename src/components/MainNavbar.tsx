import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUserName, isAuthenticated } from "../utils/userSession";
import { useCart } from "../context/CartContext";

function MainNavbar() {
  const userName = getUserName();
  const isAuth = isAuthenticated();
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    itemsCount, 
    cartTotal, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-[60]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/inicio" className="text-xl font-extrabold uppercase tracking-wide text-[#e11d2e]">
          Marimon
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <NavLink to="/inicio" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            INICIO
          </NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            CATALOGO
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            SERVICIOS
          </NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            NOSOTROS
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Botón Carrito */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#e11d2e]"
          >
            <i className="bi bi-cart3 text-xl transition-transform group-hover:scale-110"></i>
            {itemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black border-2 border-black">
                {itemsCount}
              </span>
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                  {userName}
                </span>
                <Link to="/perfil" className="rounded-lg bg-[#e11d2e] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#be1020]">
                  Ver mi perfil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-300 transition hover:bg-gray-700 hover:text-white"
                  title="Cerrar sesión"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-[#e11d2e] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#be1020]">
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white md:hidden transition hover:bg-white/20"
          >
            <i className={`bi bi-${isMenuOpen ? 'x-lg' : 'list'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#111] border-t border-white/5 ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-4 gap-4">
          <NavLink to="/inicio" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest text-gray-300 hover:text-white">INICIO</NavLink>
          <NavLink to="/catalogo" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest text-gray-300 hover:text-white">CATALOGO</NavLink>
          <NavLink to="/servicios" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest text-gray-300 hover:text-white">SERVICIOS</NavLink>
          <NavLink to="/nosotros" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest text-gray-300 hover:text-white">NOSOTROS</NavLink>
          
          <div className="h-px bg-white/10 my-2"></div>
          
          {isAuth ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
                  {userName?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-200">{userName}</span>
              </div>
              <Link 
                to="/perfil" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Mi Perfil
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-center py-3 bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-3 bg-red-600 rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {/* OVERLAY: Fondo oscuro para carrito */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* OFFCANVAS CARRITO */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="bi bi-cart-fill text-[#e11d2e]"></i> Tu Carrito 
            <span className="text-sm font-normal text-gray-500">({itemsCount})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-600"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-220px)] text-black">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-500">
              <i className="bi bi-cart-x text-5xl mb-4 opacity-50 block"></i>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-xs font-bold text-gray-900">
                      <h3 className="line-clamp-2 pr-2">{item.nombre}</h3>
                      <p className="whitespace-nowrap text-[#e11d2e]">S/ {(item.precio * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-xs mt-2">
                      <div className="flex items-center border rounded bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 hover:bg-gray-200">-</button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 hover:bg-gray-200">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold hover:underline">Eliminar</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
            <div className="flex justify-between text-lg font-black text-gray-900 mb-4">
              <p>Total</p>
              <p className="text-[#e11d2e]">S/ {cartTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/pago');
              }}
              className="w-full bg-[#e11d2e] py-4 text-white font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
            >
              Ir a Pagar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavbar;
