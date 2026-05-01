import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

type Resenia = {
  id: number;
  usuarioId: string;
  usuarioNombre: string;
  puntuacion: number;
  comentario: string;
  gusto: string;
  fecha: string;
};

type ProductModalProps = {
  producto: any;
  isOpen: boolean;
  onClose: () => void;
};

function ProductModal({ producto, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [resenias, setResenias] = useState<Resenia[]>([]);
  const [loadingResenias, setLoadingResenias] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Estado para nueva reseña
  const [nuevaPuntuacion, setNuevaPuntuacion] = useState(0); // Empezamos en 0 para obligar a marcar
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [nuevoGusto, setNuevoGusto] = useState<string | null>(null); // Null para obligar a marcar
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (isOpen && producto) {
      fetchResenias();
      checkPurchase();
    }
  }, [isOpen, producto]);

  const checkPurchase = async () => {
    const userId = localStorage.getItem("id") || sessionStorage.getItem("id");
    console.log("[DEBUG MODAL] Verificando compra para Usuario:", userId, "Producto ID:", producto?.id);
    
    if (!userId || !producto) {
      console.warn("[DEBUG MODAL] Falta userId o producto para verificar compra.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/venta/ha-comprado/${userId}/${producto.id}`);
      console.log("[DEBUG MODAL] Respuesta del servidor (ha-comprado):", response.status);
      if (response.ok) {
        const bought = await response.json();
        console.log("[DEBUG MODAL] ¿Ha comprado?:", bought);
        setHasPurchased(bought);
      }
    } catch (error) {
      console.error("[DEBUG MODAL] Error en la petición ha-comprado:", error);
    }
  };

  const fetchResenias = async () => {
    setLoadingResenias(true);
    const userId = localStorage.getItem("id") || sessionStorage.getItem("id");

    try {
      const response = await fetch(`http://localhost:8080/api/resenia/producto/${producto.id}`);
      if (response.ok) {
        const data = await response.json();
        setResenias(data);
        
        // Verificar si el usuario ya comentó
        if (userId && data.some((r: Resenia) => r.usuarioId === userId)) {
          setHasReviewed(true);
        } else {
          setHasReviewed(false);
        }
      }
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
    } finally {
      setLoadingResenias(false);
    }
  };

  // Cálculo de promedio real
  const promedio = resenias.length > 0 
    ? (resenias.reduce((acc, curr) => acc + curr.puntuacion, 0) / resenias.length).toFixed(1)
    : "0";

  const handleEnviarResenia = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nuevaPuntuacion === 0 || !nuevoGusto || !nuevoComentario.trim()) {
      alert("Por favor, completa todos los campos: calificación, comentario y si te gustó el producto.");
      return;
    }

    setEnviando(true);

    const userId = localStorage.getItem("id") || sessionStorage.getItem("id");
    const nombre = localStorage.getItem("nombre") || sessionStorage.getItem("nombre");

    const reseniaPayload = {
      productoId: producto.id,
      usuarioId: userId || "anon",
      usuarioNombre: nombre || "Usuario",
      puntuacion: nuevaPuntuacion,
      comentario: nuevoComentario,
      gusto: nuevoGusto
    };

    try {
      const response = await fetch("http://localhost:8080/api/resenia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reseniaPayload),
      });

      if (response.ok) {
        setNuevoComentario("");
        setNuevaPuntuacion(0);
        setNuevoGusto(null);
        fetchResenias();
      }
    } catch (error) {
      alert("Error al enviar la reseña.");
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen || !producto) return null;

  const isLoggedIn = !!(localStorage.getItem("id") || sessionStorage.getItem("id"));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay con desenfoque dinámico */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Contenedor Principal con Scroll para Móvil */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300 custom-scrollbar">
        
        {/* Botón Cerrar Flotante */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm md:hidden"
        >
          <i className="bi bi-x-lg text-lg"></i>
        </button>

        {/* Lado Izquierdo: Imagen y Acción Rápida (Adaptable) */}
        <div className="w-full md:w-5/12 bg-slate-50 flex flex-col p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100">
          <div className="relative aspect-square mb-8 group bg-white rounded-3xl p-4 md:p-10 shadow-sm border border-slate-200/50 flex items-center justify-center overflow-hidden">
            <img 
              src={producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"} 
              alt={producto.nombre} 
              className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <div className="flex items-center justify-between px-2">
              <span className="text-3xl font-black text-[#e11d2e]">S/ {producto.precio.toFixed(2)}</span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">En stock: {producto.stock}</span>
            </div>
            <button 
              onClick={() => addToCart({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen || "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop"
              })}
              className="w-full py-4 md:py-5 bg-black text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#e11d2e] transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="bi bi-cart-plus text-lg"></i> Añadir al Carrito
            </button>
          </div>
        </div>

        {/* Lado Derecho: Detalles y Reseñas (Scroll interno) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col bg-white overflow-y-visible">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 hidden md:flex w-10 h-10 bg-slate-50 rounded-full items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <i className="bi bi-x-lg"></i>
          </button>
          
          <div className="mb-8 border-b border-slate-100 pb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Producto Original</p>
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{producto.nombre}</h2>
            <p className="text-slate-500 leading-relaxed font-medium">
              {producto.descripcion || "No hay descripción disponible para este producto."}
            </p>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">Opiniones del producto</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#e11d2e] bg-red-50 px-3 py-1 rounded-full">
                  <i className="bi bi-star-fill text-xs"></i>
                  <span className="font-black text-sm">{promedio}</span>
                </div>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{resenias.length} reseñas</span>
              </div>
            </div>

            {/* LISTA DE RESEÑAS */}
            <div className="space-y-6 mb-10">
              {loadingResenias ? (
                <p className="text-center text-slate-400 py-4 animate-pulse">Cargando comentarios...</p>
              ) : resenias.length > 0 ? (
                resenias.map((r) => (
                  <div key={r.id} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-200">
                        {r.usuarioNombre.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{r.usuarioNombre}</h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(r.fecha).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-red-500">
                          {[1,2,3,4,5].map((s) => (
                            <i key={s} className={`bi bi-star${s <= r.puntuacion ? '-fill' : ''}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium italic">"{r.comentario}"</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${r.gusto === 'Si' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <i className={`bi bi-hand-thumbs-${r.gusto === 'Si' ? 'up' : 'down'}`}></i>
                      {r.gusto === 'Si' ? 'Lo recomiendo' : 'No lo recomienda'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <i className="bi bi-chat-left-dots text-3xl text-slate-200 mb-2"></i>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest italic">Aún no hay opiniones.</p>
                </div>
              )}
            </div>

            {/* FORMULARIO DE RESEÑA CON VALIDACIONES */}
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-8 shadow-sm">
              {!isLoggedIn ? (
                <div className="text-center py-4">
                  <p className="text-sm font-bold text-slate-500 mb-4">Debes iniciar sesión para dejar una reseña.</p>
                  <a href="/login" className="inline-block px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition">Iniciar Sesión</a>
                </div>
              ) : !hasPurchased ? (
                <div className="text-center py-4 bg-orange-50 rounded-2xl border border-orange-100 p-6">
                  <i className="bi bi-shield-lock text-2xl text-orange-400 mb-2 block"></i>
                  <h4 className="text-sm font-black text-orange-900 uppercase mb-2">Compra verificada requerida</h4>
                  <p className="text-xs font-medium text-orange-700 leading-relaxed">
                    Primero debes comprar este producto para poder compartir tu experiencia con la comunidad.
                  </p>
                </div>
              ) : hasReviewed ? (
                <div className="text-center py-6 bg-green-50 rounded-[2rem] border border-green-100 p-8 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm shadow-green-100">
                    <i className="bi bi-patch-check-fill text-3xl text-green-500"></i>
                  </div>
                  <h4 className="text-lg font-black text-green-900 uppercase tracking-tight mb-2">¡Gracias por tu opinión!</h4>
                  <p className="text-sm font-medium text-green-700/80 leading-relaxed max-w-[280px] mx-auto">
                    Tu reseña ha sido registrada. Valoramos mucho tu experiencia en Marimon Repuestos.
                  </p>
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-black text-slate-900 mb-6 text-center tracking-tight">Cuéntanos tu experiencia</h4>
                  <form onSubmit={handleEnviarResenia} className="space-y-6">
                    <div className="flex flex-col items-center gap-2 mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tu calificación</p>
                      <div className="flex gap-2 text-2xl">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i 
                            key={s} 
                            onClick={() => setNuevaPuntuacion(s)}
                            className={`bi bi-star${s <= nuevaPuntuacion ? '-fill text-red-500' : ' text-slate-200'} cursor-pointer transition-all hover:scale-110 active:scale-90`}
                          ></i>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tu comentario</label>
                      <textarea 
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        required
                        placeholder="¿Cómo fue tu experiencia con el producto?"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all min-h-[120px] resize-none"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => setNuevoGusto("Si")}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${nuevoGusto === 'Si' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          <i className="bi bi-hand-thumbs-up"></i> SÍ ME GUSTÓ
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setNuevoGusto("No")}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all ${nuevoGusto === 'No' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          <i className="bi bi-hand-thumbs-down"></i> NO ME GUSTÓ
                        </button>
                      </div>
                      <button 
                        type="submit"
                        disabled={enviando || nuevaPuntuacion === 0 || !nuevoGusto || !nuevoComentario.trim()}
                        className="w-full sm:w-auto px-10 py-4 bg-[#e11d2e] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#be1020] transition-all shadow-xl shadow-red-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
                      >
                        {enviando ? "Publicando..." : "Publicar Reseña"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
