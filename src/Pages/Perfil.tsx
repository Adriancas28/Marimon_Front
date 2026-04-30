import { useEffect, useState } from "react";
import MainNavbar from "../components/MainNavbar";
import { getSessionValue, getUserName } from "../utils/userSession";
import { Link } from "react-router-dom";

interface Pedido {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  metodoPago?: { nombre: string };
  detalles: Array<{
    producto: { nombre: string };
    cantidad: number;
    precioUnitario: number;
  }>;
}

function Perfil() {
  const nombre = getUserName();
  const token = getSessionValue("token");
  const usuarioId = getSessionValue("id");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (usuarioId) {
      fetch(`/api/venta/usuario/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          setPedidos(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar pedidos:", err);
          setLoading(false);
        });
    }
  }, [usuarioId]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900 pb-20">
      <MainNavbar />

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        {/* Sección de Datos del Usuario */}
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10 mb-8 transition-all hover:shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e11d2e]">Mi Cuenta</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="mt-2 text-3xl font-extrabold">Hola, {nombre}</h1>
            <button 
              onClick={() => { sessionStorage.clear(); localStorage.clear(); window.location.href = "/"; }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all"
            >
              CERRAR SESIÓN
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Nombre Completo</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{nombre}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Estado de sesión</p>
              <p className="mt-1 text-sm text-slate-700 font-medium">
                {token ? "✓ Activa y Segura" : "⚠ Sesión no detectada"}
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Mis Pedidos */}
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
              <i className="bi bi-box-seam text-xl"></i>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Mis Pedidos Recientes</h2>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-slate-500 text-sm">Buscando tus compras...</p>
            </div>
          ) : pedidos.length > 0 ? (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden transition-all hover:border-slate-300">
                  <button 
                    onClick={() => setOpenId(openId === pedido.id ? null : pedido.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">Orden #{pedido.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          pedido.estado === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{new Date(pedido.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-black text-slate-900">S/ {pedido.total.toFixed(2)}</span>
                      <i className={`bi bi-chevron-${openId === pedido.id ? 'up' : 'down'} text-slate-400`}></i>
                    </div>
                  </button>

                  {openId === pedido.id && (
                    <div className="px-6 pb-6 bg-slate-50/50 border-t border-slate-100 animate-[fadeIn_0.3s_ease]">
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-slate-400 font-bold border-b border-slate-200">
                              <th className="pb-2">Producto</th>
                              <th className="pb-2 text-center">Cant.</th>
                              <th className="pb-2 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {pedido.detalles?.map((det, i) => (
                              <tr key={i}>
                                <td className="py-3 font-medium text-slate-800">{det.producto?.nombre || "Producto"}</td>
                                <td className="py-3 text-center text-slate-600">{det.cantidad}</td>
                                <td className="py-3 text-right font-bold text-slate-900">S/ {(det.cantidad * det.precioUnitario).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-500 italic">Pago realizado vía {pedido.metodoPago?.nombre || 'Online'}</span>
                        <Link to="/pago-exitoso" className="bg-[#e11d2e] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c11827] transition-all">
                          Ver Recibo
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200">
                <i className="bi bi-cart-x text-4xl text-slate-300 mb-3 block"></i>
                <p className="text-slate-500 font-medium">Aún no tienes pedidos registrados.</p>
                <Link to="/catalogo" className="mt-4 inline-block text-[#e11d2e] font-bold hover:underline">
                  ¡Empieza a comprar aquí!
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Perfil;
