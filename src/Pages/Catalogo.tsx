import { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
  alto?: string;
};

function Catalogo() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/productos");
        if (!response.ok) {
          throw new Error("No se pudo cargar el catálogo.");
        }
        const data = await response.json();
        // Defensive check just in case the backend returns an object wrapper (like Spring Boot Pagination)
        const prdArray = Array.isArray(data) ? data : (data?.content || data?.data || []);
        
        // Ensure numeric parsing for precio and stock since APIs sometimes return them as strings or null
        const processed = prdArray.map((p: any) => ({
          ...p,
          precio: Number(p.precio) || 0,
          stock: Number(p.stock) || 0
        }));
        
        setProductos(processed);
      } catch (err) {
        setError("Ocurrió un problema al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900">
      <MainNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <section className="rounded-2xl border border-[#e4e4df] bg-white p-6 md:p-8">
          <div className="mb-8 border-b border-[#e8e8e2] pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b5f3a]">
              Catalogo
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1b1b1b] md:text-4xl">
              Productos destacados
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[#5a5a52]">
              Lista de productos destacados.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="bi bi-arrow-repeat animate-spin text-5xl text-[#0b5f3a] mb-4"></i>
              <p className="text-gray-500 font-medium">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-slate-100 font-medium text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Reintentar
              </button>
            </div>
          ) : productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <i className="bi bi-box-seam text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-500 font-medium">No hay productos en el catálogo actualmente.</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 xl:columns-4">
              {productos.map((producto) => (
                <article
                  key={producto.id}
                  className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-[#e8e8e2] bg-white transition hover:shadow-md flex flex-col h-full"
                >
                  <div className={`h-56 bg-[#f1f2ed] border-b border-gray-100 overflow-hidden relative`}>
                    <img 
                      src={producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#6e6e65]">Producto automotriz</p>
                      <h2 className="mt-1 text-sm font-semibold text-[#1f1f1a] line-clamp-2">{producto.nombre}</h2>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#66665d]">
                        {producto.descripcion}
                      </p>
                    </div>
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-[#0b5f3a]">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-[#66665d]">Stock: {producto.stock}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button className="flex-1 rounded-md border border-[#0b5f3a] px-2.5 py-1.5 text-xs font-semibold text-[#0b5f3a] transition hover:bg-[#0b5f3a] hover:text-white">
                          Ver
                        </button>
                        <button onClick={() => addToCart({
                            id: producto.id,
                            nombre: producto.nombre,
                            precio: producto.precio,
                            imagen: producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"
                          })} 
                          className="flex-2 rounded-md bg-[#0b5f3a] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#084b2e] shadow-sm flex items-center justify-center gap-1 cursor-pointer">
                          <i className="bi bi-cart-plus"></i> Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Catalogo;