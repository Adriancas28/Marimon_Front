import { useState, useEffect, useCallback } from "react";
import MainNavbar from "../components/MainNavbar";
import { useCart } from "../context/CartContext";
import ProductModal from "../components/ProductModal";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoriaId?: number;
};

type Categoria = {
  id: number;
  nombre: string;
};

const API_URL = import.meta.env.VITE_API_URL || "https://marimonbackend.onrender.com";
const PAGE_SIZE = 15; // productos por página en frontend cuando hay filtros

function Catalogo() {
  const { addToCart } = useCart();

  // Todos los productos cargados del backend
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false); // cargando todas las páginas
  const [error, setError] = useState("");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginasAPI, setTotalPaginasAPI] = useState(1);  // páginas reales del backend
  const [paginaActualAPI, setPaginaActualAPI] = useState(1);  // página que hemos cargado del backend

  // Modal
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Cargar categorías y búsquedas recientes al montar ──────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));

    fetch(`${API_URL}/api/categoria`)
      .then((r) => r.json())
      .then((data: Categoria[]) => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setCategorias([]));
  }, []);

  // ── Cargar una página del backend (sin filtros activos) ────────────────────
  const fetchPaginaBackend = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/producto?pagina=${page}`);
      if (!res.ok) throw new Error("Error al cargar productos.");
      const data = await res.json();
      const arr: Producto[] = (Array.isArray(data) ? data : data?.data ?? []).map((p: any) => ({
        ...p,
        precio: Number(p.precio) || 0,
        stock: Number(p.stock) || 0,
      }));
      if (data?.totalPaginas) setTotalPaginasAPI(data.totalPaginas);
      setPaginaActualAPI(page);
      setTodosLosProductos(arr); // solo guardamos la página actual cuando NO hay filtro
    } catch {
      setError("Ocurrió un problema al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Cargar TODOS los productos (necesario para filtrar por categoría) ──────
  const fetchTodosLosProductos = useCallback(async () => {
    setLoadingAll(true);
    setLoading(true);
    setError("");
    try {
      // Primero obtenemos la primera página para saber cuántas hay
      const res1 = await fetch(`${API_URL}/api/producto?pagina=1`);
      if (!res1.ok) throw new Error("Error al cargar productos.");
      const data1 = await res1.json();
      const totalPags: number = data1?.totalPaginas ?? 1;
      setTotalPaginasAPI(totalPags);

      const parseArr = (d: any): Producto[] =>
        (Array.isArray(d) ? d : d?.data ?? []).map((p: any) => ({
          ...p,
          precio: Number(p.precio) || 0,
          stock: Number(p.stock) || 0,
        }));

      // Cargar el resto de páginas en paralelo
      const requests = Array.from({ length: totalPags - 1 }, (_, i) =>
        fetch(`${API_URL}/api/producto?pagina=${i + 2}`).then((r) => r.json())
      );
      const rest = await Promise.all(requests);

      const todos: Producto[] = [
        ...parseArr(data1),
        ...rest.flatMap((d) => parseArr(d)),
      ];

      setTodosLosProductos(todos);
    } catch {
      setError("Ocurrió un problema al conectar con el servidor.");
    } finally {
      setLoading(false);
      setLoadingAll(false);
    }
  }, []);

  // ── Efecto principal: decidir si cargar todo o solo una página ─────────────
  const hayFiltroCategoria = selectedCategories.length > 0;

  useEffect(() => {
    if (hayFiltroCategoria) {
      // Con filtro de categoría → necesitamos TODOS los productos
      fetchTodosLosProductos();
      setPagina(1); // resetear paginación frontend
    } else {
      // Sin filtro → paginación normal del backend
      fetchPaginaBackend(pagina);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  useEffect(() => {
    if (!hayFiltroCategoria) {
      fetchPaginaBackend(pagina);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  // ── Filtrar y ordenar ──────────────────────────────────────────────────────
  const productosFiltrados = todosLosProductos
    .filter((p) => {
      const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategories.length === 0 ||
        (p.categoriaId !== undefined && selectedCategories.includes(p.categoriaId));
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "asc") return a.precio - b.precio;
      if (sortBy === "desc") return b.precio - a.precio;
      if (sortBy === "new") return b.id - a.id;
      return 0;
    });

  // Paginación frontend (solo cuando hay filtro de categoría o búsqueda)
  const usandoPaginacionFrontend = hayFiltroCategoria || searchTerm.trim() !== "";
  const totalPaginasFrontend = Math.max(1, Math.ceil(productosFiltrados.length / PAGE_SIZE));

  const productosVisibles = usandoPaginacionFrontend
    ? productosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE)
    : productosFiltrados; // backend ya nos da los 15 de esa página

  const totalPaginasMostradas = usandoPaginacionFrontend ? totalPaginasFrontend : totalPaginasAPI;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getNombreCategoria = (catId?: number) => {
    if (!catId) return "Repuesto Original";
    return categorias.find((c) => c.id === catId)?.nombre ?? "Repuesto Original";
  };

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    setPagina(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setPagina(1);
  };

  const limpiarFiltros = () => {
    setSelectedCategories([]);
    setSortBy("");
    setSearchTerm("");
    setPagina(1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <MainNavbar />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

        {/* BUSCADOR */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 ring-1 ring-slate-200/50">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <i className="bi bi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="¿Qué repuesto estás buscando hoy?"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPagina(1); }}
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
                      <button key={i} onClick={() => { setSearchTerm(s); setPagina(1); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
                        <i className="bi bi-clock-history mr-2 opacity-50"></i> {s}
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-center text-slate-400 font-medium">No hay búsquedas recientes</p>
                  )}
                </div>
              </div>
              <button onClick={handleSearch}
                className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#e11d2e] transition shadow-lg shadow-black/10 active:scale-95">
                BUSCAR
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-8 sticky top-24">

              {/* ORDENAR */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <div className="w-1 h-3 bg-red-500 rounded-full"></div> Ordenar por
                </h3>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all cursor-pointer">
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
                {loadingAll && (
                  <p className="text-xs text-slate-400 font-semibold mb-2 flex items-center gap-1">
                    <i className="bi bi-arrow-repeat animate-spin"></i> Cargando productos…
                  </p>
                )}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {categorias.slice(0, showAllCategories ? undefined : 5).map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="h-5 w-5 rounded-lg border-slate-200 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                      />
                      <span className={`text-sm font-semibold transition-colors ${
                        selectedCategories.includes(cat.id) ? "text-red-600" : "text-slate-600 group-hover:text-slate-900"
                      }`}>
                        {cat.nombre}
                      </span>
                    </label>
                  ))}
                </div>
                {categorias.length > 5 && (
                  <button onClick={() => setShowAllCategories(!showAllCategories)}
                    className="mt-4 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-all">
                    {showAllCategories ? "Ver menos" : "Ver más categorías"}
                    <i className={`bi bi-chevron-${showAllCategories ? "up" : "down"}`}></i>
                  </button>
                )}
              </div>

              {/* LIMPIAR */}
              {(selectedCategories.length > 0 || sortBy !== "" || searchTerm !== "") && (
                <button onClick={limpiarFiltros}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2">
                  <i className="bi bi-x-circle"></i> LIMPIAR FILTROS
                </button>
              )}
            </div>
          </aside>

          {/* PRODUCTOS */}
          <main className="flex-1">

            {/* Contador */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-slate-500">
                  <span className="text-slate-800 font-black">{productosFiltrados.length}</span> producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
                  {selectedCategories.length > 0 && (
                    <span className="ml-2 text-red-500 font-bold">
                      · {selectedCategories.map(id => getNombreCategoria(id)).join(", ")}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400 font-semibold">
                  Página {pagina} de {totalPaginasMostradas}
                </p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <button onClick={() => hayFiltroCategoria ? fetchTodosLosProductos() : fetchPaginaBackend(pagina)}
                  className="px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-full hover:bg-red-100 transition">
                  Reintentar
                </button>
              </div>
            ) : productosVisibles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                <img src="https://cdn-icons-png.flaticon.com/512/5622/5622660.png" alt="Sin productos"
                  className="w-24 h-24 mx-auto mb-6 opacity-40 grayscale" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron productos</h3>
                <p className="text-slate-500 font-medium">Intenta con otros filtros o términos de búsqueda.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productosVisibles.map((producto) => (
                    <article key={producto.id}
                      className="group bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col">
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
                            {getNombreCategoria(producto.categoriaId)}
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
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${producto.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {producto.stock > 0 ? `Stock: ${producto.stock}` : "Agotado"}
                          </div>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => { setSelectedProduct(producto); setIsModalOpen(true); }}
                            className="py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-[11px] text-center hover:bg-slate-200 transition">
                            DETALLES
                          </button>
                          <button
                            disabled={producto.stock === 0}
                            onClick={() => addToCart({
                              id: producto.id,
                              nombre: producto.nombre,
                              precio: producto.precio,
                              imagen: producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop",
                            })}
                            className="py-2.5 bg-[#e11d2e] text-white rounded-xl font-bold text-[11px] hover:bg-[#be1020] transition shadow-lg shadow-red-500/10 flex items-center justify-center gap-1 disabled:opacity-50 disabled:grayscale">
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
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-30 flex items-center gap-2">
                    <i className="bi bi-chevron-left"></i> Anterior
                  </button>
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {[...Array(totalPaginasMostradas)].map((_, i) => (
                      <button key={i} onClick={() => setPagina(i + 1)}
                        className={`w-10 h-10 rounded-full font-bold text-sm transition ${pagina === i + 1 ? "bg-[#e11d2e] text-white" : "bg-white text-slate-500 hover:bg-slate-100"}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={pagina === totalPaginasMostradas}
                    onClick={() => setPagina((p) => Math.min(totalPaginasMostradas, p + 1))}
                    className="px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-[#e11d2e] transition disabled:opacity-30 flex items-center gap-2 shadow-lg shadow-black/5">
                    Siguiente <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <ProductModal producto={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Catalogo;