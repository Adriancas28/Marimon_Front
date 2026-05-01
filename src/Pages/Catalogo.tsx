import { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import ProductModal from "../components/ProductModal";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria?: string;
};

const CATEGORIAS_MOCK = [
  "Motor", "Suspensión", "Frenos", "Electricidad", "Filtros", "Lubricantes", "Carrocería", "Iluminación"
];

function Catalogo() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estado para el Modal
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Cargar búsquedas recientes del localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));

    fetchProductos();
  }, [pagina, sortBy]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      // Nota: El backend actualmente no soporta filtros complejos, así que los simularemos en el front por ahora
      // o usaremos los params que existan.
      const API_URL = import.meta.env.VITE_API_URL || "https://marimonbackend.onrender.com";
      const response = await fetch(`${API_URL}/api/producto?pagina=${pagina}`);
      if (!response.ok) throw new Error("No se pudo cargar el catálogo.");
      
      const data = await response.json();
      const prdArray = Array.isArray(data) ? data : (data?.content || data?.data || []);
      
      // Manejar paginación si el backend la envía
      if (data?.totalPages) setTotalPaginas(data.totalPages);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Guardar en búsquedas recientes
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    
    // Aquí se llamaría a la búsqueda del API
    // Por simplicidad en esta demo, filtramos el estado local o recargamos con param
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || (p.categoria && selectedCategories.includes(p.categoria));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <MainNavbar />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        
        {/* BUSCADOR SUPERIOR */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <i className="bi bi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text"
                placeholder="¿Qué repuesto estás buscando hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-slate-700 placeholder:text-slate-400 font-medium"
              />
            </form>
            
            <div className="flex items-center gap-2 w-full md:w-auto px-2">
              <div className="relative group flex-1 md:flex-none">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition whitespace-nowrap w-full">
                  Búsquedas recientes <i className="bi bi-chevron-down text-[10px]"></i>
                </button>
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSearchTerm(s)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                      >
                        <i className="bi bi-clock-history mr-2 opacity-50"></i> {s}
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-center text-slate-400 font-medium">No hay búsquedas recientes</p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#e11d2e] transition shadow-lg shadow-black/10 active:scale-95"
              >
                BUSCAR
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-8 sticky top-24">
              
              {/* ORDENAMIENTO */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <div className="w-1 h-3 bg-red-500 rounded-full"></div> Ordenar por
                </h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all cursor-pointer"
                >
                  <option value="">Seleccionar</option>
                  <option value="asc">Precio: Menor a Mayor</option>
                  <option value="desc">Precio: Mayor a Menor</option>
                  <option value="new">Novedades</option>
                </select>
              </div>

              {/* CATEGORÍAS */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <div className="w-1 h-3 bg-red-500 rounded-full"></div> Categorías
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {CATEGORIAS_MOCK.slice(0, showAllCategories ? undefined : 5).map((cat) => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="h-5 w-5 rounded-lg border-slate-200 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                      />
                      <span className={`text-sm font-semibold transition-colors ${selectedCategories.includes(cat) ? 'text-red-600' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="mt-4 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-all"
                >
                  {showAllCategories ? "Ver menos" : "Ver más categorías"} 
                  <i className={`bi bi-chevron-${showAllCategories ? 'up' : 'down'}`}></i>
                </button>
              </div>

              <button 
                onClick={fetchProductos}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                <i className="bi bi-filter"></i> APLICAR FILTROS
              </button>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL (PRODUCTOS) */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-[400px] bg-white rounded-3xl border border-slate-100"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-3xl p-12 text-center border border-red-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">¡Oops! Algo salió mal</h3>
                <p className="text-red-700/70 font-medium mb-6">{error}</p>
                <button onClick={fetchProductos} className="px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-full hover:bg-red-100 transition">
                  Reintentar
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/5622/5622660.png" alt="No products" className="w-24 h-24 mx-auto mb-6 opacity-40 grayscale" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron productos</h3>
                <p className="text-slate-500 font-medium">Intenta con otros filtros o términos de búsqueda.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((producto) => (
                    <article key={producto.id} className="group bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col">
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-6">
                        <img 
                          src={producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"} 
                          alt={producto.nombre} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                        />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md border border-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                          <i className="bi bi-heart"></i>
                        </button>
                      </div>

                      <div className="px-2 flex-1 flex flex-col">
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {producto.categoria || "Repuesto Original"}
                          </p>
                          <h2 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight min-h-[2.5rem]">
                            {producto.nombre}
                          </h2>
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Precio contado</p>
                            <p className="text-xl font-black text-[#e11d2e]">S/ {producto.precio.toFixed(2)}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${producto.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(producto);
                              setIsModalOpen(true);
                            }}
                            className="py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-[11px] text-center hover:bg-slate-200 transition"
                          >
                            DETALLES
                          </button>
                          <button 
                            disabled={producto.stock === 0}
                            onClick={() => addToCart({
                              id: producto.id,
                              nombre: producto.nombre,
                              precio: producto.precio,
                              imagen: producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"
                            })}
                            className="py-2.5 bg-[#e11d2e] text-white rounded-xl font-bold text-[11px] hover:bg-[#be1020] transition shadow-lg shadow-red-500/10 flex items-center justify-center gap-1 disabled:opacity-50 disabled:grayscale"
                          >
                            <i className="bi bi-cart-plus"></i> AÑADIR
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* PAGINACIÓN */}
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button 
                    disabled={pagina === 1}
                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30 flex items-center gap-2"
                  >
                    <i className="bi bi-chevron-left"></i> Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPaginas)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setPagina(i + 1)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition ${pagina === i + 1 ? 'bg-[#e11d2e] text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={pagina === totalPaginas}
                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                    className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-[#e11d2e] transition disabled:opacity-30 flex items-center gap-2 shadow-lg shadow-black/5"
                  >
                    Siguiente <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <ProductModal 
        producto={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Catalogo;