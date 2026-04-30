import { useEffect, useState } from 'react';
import MainNavbar from '../components/MainNavbar';
import { Link } from 'react-router-dom';

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

export default function PerfilPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const usuarioId = sessionStorage.getItem('id') || localStorage.getItem('id');

  useEffect(() => {
    if (usuarioId) {
      fetch(`/api/venta/usuario/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
          setPedidos(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al cargar pedidos:", err);
          setLoading(false);
        });
    }
  }, [usuarioId]);

  const togglePedido = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar (Basado en tu ejemplo) */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800">Mi Perfil</h3>
              </div>
              <div className="flex flex-col">
                <Link to="/perfil" className="px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors border-l-4 border-transparent">
                  Detalle de la cuenta
                </Link>
                <div className="px-6 py-4 bg-green-50 text-green-700 font-bold border-l-4 border-green-600">
                  Mis Pedidos
                </div>
                <button 
                  onClick={() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="px-6 py-4 text-red-600 hover:bg-red-50 transition-colors text-left font-semibold"
                >
                  SALIR
                </button>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Mis Pedidos</h2>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Cargando tus compras...</p>
              </div>
            ) : pedidos.length > 0 ? (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <button 
                      onClick={() => togglePedido(pedido.id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-bold text-gray-800">Pedido #{pedido.id}</span>
                        <span className="text-gray-500 text-sm">{new Date(pedido.fecha).toLocaleDateString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          pedido.estado === 'Completado' ? 'bg-green-100 text-green-700' : 
                          pedido.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {pedido.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-green-700 text-lg">S/ {pedido.total.toFixed(2)}</span>
                        <i className={`bi bi-chevron-${openId === pedido.id ? 'up' : 'down'} text-gray-400`}></i>
                      </div>
                    </button>

                    {openId === pedido.id && (
                      <div className="px-6 pb-6 border-t border-gray-50 animate-fadeIn">
                        <div className="mt-4 overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="pb-3 font-semibold">Producto</th>
                                <th className="pb-3 font-semibold text-center">Cant.</th>
                                <th className="pb-3 font-semibold text-right">Precio</th>
                                <th className="pb-3 font-semibold text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {pedido.detalles.map((detalle, idx) => (
                                <tr key={idx} className="text-sm">
                                  <td className="py-4 font-medium text-gray-800">{detalle.producto?.nombre || 'Producto'}</td>
                                  <td className="py-4 text-center">{detalle.cantidad}</td>
                                  <td className="py-4 text-right">S/ {detalle.precioUnitario.toFixed(2)}</td>
                                  <td className="py-4 text-right font-bold">S/ {(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                           <div className="text-sm text-gray-500">
                             <strong>Método de Pago:</strong> {pedido.metodoPago?.nombre || 'No especificado'}
                           </div>
                           <Link to={`/comprobante/${pedido.id}`} className="text-green-600 font-bold hover:underline text-sm">
                             Ver Comprobante Digital
                           </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-100 rounded-2xl p-10 text-center">
                <i className="bi bi-cart-x text-5xl text-yellow-400 mb-4 block"></i>
                <h4 className="text-xl font-bold text-yellow-800 mb-2">No se encontraron Pedidos</h4>
                <p className="text-yellow-700 mb-6">Parece que aún no has realizado ninguna compra con nosotros.</p>
                <Link to="/catalogo" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all">
                  Empezar a Comprar
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
