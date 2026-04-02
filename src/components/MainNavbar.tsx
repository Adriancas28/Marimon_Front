import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUserName } from "../utils/userSession";
import { useCart } from "../context/CartContext";

function MainNavbar() {
  const userName = getUserName();
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen, itemsCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/inicio" className="text-xl font-extrabold uppercase tracking-wide text-[#e11d2e]">
          Marimon
        </Link>

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

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#e11d2e] mr-2"
          >
            <i className="bi bi-cart3 text-xl transition-transform group-hover:scale-110"></i>
            {itemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-black border-2 border-black animate-[pulse-scale_1s_ease_infinite]">
                {itemsCount}
              </span>
            )}
          </button>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 sm:inline">
            {userName}
          </span>
          <Link to="/perfil" className="rounded-lg bg-[#e11d2e] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#be1020]">
            Ver mi perfil
          </Link>
        </div>
      </div>

      {/* OVERLAY: Fondo oscuro */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      {/* OFFCANVAS CARRITO */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-[350px] sm:w-[400px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-4 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="bi bi-cart-fill text-[#e11d2e]"></i> Tu Carrito 
            <span className="text-sm font-normal text-gray-500">({itemsCount} productos)</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-600"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)] text-black">
          {cartItems.length === 0 ? (
            <div className="flexflex-col items-center justify-center h-48 text-center text-gray-500">
              <i className="bi bi-cart-x text-5xl mb-4 opacity-50 block"></i>
              <p>Tu carrito está vacío.</p>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="mt-4 text-[#e11d2e] font-semibold hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item.id} className="py-4 flex gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <h3 className="line-clamp-2 pr-2">{item.nombre}</h3>
                      <div className="ml-4 text-right">
                        <p className="whitespace-nowrap text-[#0b5f3a] font-bold">S/ {(item.precio * item.quantity).toFixed(2)}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-500">S/ {item.precio.toFixed(2)} c/u</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-3">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="px-2 font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <div className="flex">
                        <button 
                          type="button" 
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 transition flex items-center gap-1"
                        >
                          <i className="bi bi-trash"></i> <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 bg-white absolute bottom-0 w-full shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
              <p>Total</p>
              <p className="text-[#0b5f3a]">S/ {cartTotal.toFixed(2)}</p>
            </div>
            
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/pago');
              }}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-[#e11d2e] to-[#be1020] px-6 py-4 text-base font-bold tracking-wide text-white shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              Ir a Pagar <i className="bi bi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
              <p>
                o{' '}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="font-medium text-[#e11d2e] hover:text-[#be1020] hover:underline"
                >
                  Continuar Comprando<span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default MainNavbar;
