import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface DetalleVenta {
  Id: number;
  ProductoId: number;
  Producto?: {
    Nombre: string;
    nombre?: string;
  };
  Cantidad: number;
  PrecioUnitario: number;
}

interface Venta {
  Id: number;
  Fecha: string;
  UsuarioId: string;
  Usuario?: {
    Nombre: string;
    nombre?: string;
    Correo: string;
    correo?: string;
  };
  Total: number;
  Estado: string;
  MetodoPagoId: number;
  MetodoPago?: {
    Nombre: string;
    nombre?: string;
  };
  Detalles: DetalleVenta[];
}

type ToastType = 'success' | 'info' | 'error';
interface Toast { id: number; type: ToastType; message: string; }

const toastColors: Record<ToastType, string> = { success: 'bg-emerald-500', info: 'bg-blue-500', error: 'bg-red-600' };
const toastIcons: Record<ToastType, string> = { success: '✓', info: 'ℹ', error: '⚠' };

const AdminCompras = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchVentas = useCallback(async () => {
    try {
      const res = await fetch('/api/venta');
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const normalized = (Array.isArray(data) ? data : []).map((v: any) => ({
        Id: v.id ?? v.Id,
        Fecha: v.fecha ?? v.Fecha,
        UsuarioId: v.usuarioId ?? v.UsuarioId,
        Usuario: v.usuario ?? v.Usuario,
        Total: v.total ?? v.Total,
        Estado: v.estado ?? v.Estado,
        MetodoPagoId: v.metodoPagoId ?? v.MetodoPagoId ?? 0,
        MetodoPago: v.metodoPago ?? v.MetodoPago,
        Detalles: (v.detalles ?? v.Detalles ?? []).map((d: any) => ({
          Id: d.id ?? d.Id,
          ProductoId: d.productoId ?? d.ProductoId,
          Producto: d.producto ?? d.Producto,
          Cantidad: d.cantidad ?? d.Cantidad,
          PrecioUnitario: d.precioUnitario ?? d.PrecioUnitario
        }))
      }));

      setVentas(normalized.sort((a, b) => (b.Id ?? 0) - (a.Id ?? 0)));
    } catch {
      showToast('error', 'Error al cargar las ventas.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchVentas(); }, [fetchVentas]);

  const filtered = ventas.filter(v => {
    const s = search.toLowerCase();
    const userName = (v.Usuario?.Nombre || v.Usuario?.nombre || '').toLowerCase();
    const userEmail = (v.Usuario?.Correo || v.Usuario?.correo || '').toLowerCase();
    const estado = (v.Estado ?? '').toLowerCase();
    return userName.includes(s) || userEmail.includes(s) || estado.includes(s) || (v.Id ?? '').toString().includes(s);
  });

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'pendiente': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'cancelado': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 min-w-[320px] border-l-4 border-l-[#d42025]">
            <span className={`${toastColors[t.type]} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm`}>{toastIcons[t.type]}</span>
            <p className="text-sm text-gray-700 font-semibold">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-[#d42025] text-white py-5 px-8 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Panel
          </Link>
          <div className="h-8 w-px bg-white/20" />
          <h1 className="m-0 text-2xl font-bold tracking-tight">Historial de Ventas</h1>
        </div>
        <div className="flex items-center gap-4">
           <span className="bg-black/20 rounded-full px-4 py-1.5 text-sm font-bold border border-white/10 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             {ventas.length} Pedidos Totales
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1500px] mx-auto p-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-3 text-sm">
            <li><Link to="/admin" className="text-gray-500 hover:text-[#d42025] transition-colors font-semibold">Administración</Link></li>
            <li className="text-gray-400 font-bold">/</li>
            <li className="text-[#d42025] font-black uppercase tracking-widest text-xs">Ventas</li>
          </ol>
        </nav>

        {/* Top bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar por cliente, ID o estado..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-12 py-3.5 text-sm outline-none transition focus:border-[#d42025] focus:bg-white focus:ring-4 focus:ring-red-50 font-medium" />
          </div>
          <div className="flex gap-3">
            <button onClick={fetchVentas} className="flex items-center gap-2 rounded-xl bg-[#1c1c1c] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-black hover:-translate-y-0.5 active:translate-y-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Actualizar Lista
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 border border-gray-100">
          <div className="overflow-x-auto" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Orden</th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Fecha y Hora</th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Cliente</th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Pago</th>
                  <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-xs">Monto Total</th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-xs">Estado</th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-xs">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={7} className="py-24 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#d42025]" />
                      <span className="font-bold text-gray-500 animate-pulse">Obteniendo ventas...</span>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                       <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                       <p className="text-xl font-bold">No hay registros</p>
                    </div>
                  </td></tr>
                ) : (
                  filtered.map((v, i) => (
                    <tr key={v.Id} className={`transition-all hover:bg-red-50/30 group ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 font-mono text-xs font-bold text-gray-600">
                          ORD-{v.Id.toString().padStart(5, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap">
                        {new Date(v.Fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">{new Date(v.Fecha).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 leading-tight">{v.Usuario?.Nombre || v.Usuario?.nombre || 'Invitado'}</span>
                          <span className="text-xs text-gray-500 font-medium">{v.Usuario?.Correo || v.Usuario?.correo || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <div className={`w-2 h-2 rounded-full ${v.MetodoPago?.Nombre?.toLowerCase().includes('yape') ? 'bg-purple-500' : 'bg-blue-500'}`} />
                          {v.MetodoPago?.Nombre || v.MetodoPago?.nombre || 'Efectivo'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                          S/ {v.Total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(v.Estado)}`}>
                          {v.Estado}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          <button onClick={() => { setSelectedVenta(v); setShowDetails(true); }} className="flex items-center gap-2 rounded-xl bg-white border-2 border-gray-100 px-4 py-2 text-xs font-black text-gray-700 transition-all hover:bg-[#d42025] hover:text-white hover:border-[#d42025] hover:shadow-lg hover:-translate-y-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            VER TICKET
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: DETALLES (Ticket) */}
      {showDetails && selectedVenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setShowDetails(false)}>
          <div className="w-full max-w-2xl animate-modal-in rounded-3xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Cabecera del Ticket */}
            <div className="bg-[#1c1c1c] px-8 py-6 text-white flex justify-between items-center relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#d42025]" />
               <div>
                 <h3 className="text-xl font-black tracking-tight">RESUMEN DE VENTA</h3>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Orden #{selectedVenta.Id.toString().padStart(5, '0')}</p>
               </div>
               <button onClick={() => setShowDetails(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-2xl font-light">&times;</button>
            </div>

            <div className="p-8">
              {/* Info Cliente & Pago */}
              <div className="grid grid-cols-2 gap-8 mb-8 border-b border-dashed border-gray-200 pb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-2">Datos del Cliente</p>
                  <p className="text-lg font-black text-gray-900 leading-none mb-1">{selectedVenta.Usuario?.Nombre || selectedVenta.Usuario?.nombre || 'Cliente Marimon'}</p>
                  <p className="text-sm text-gray-500 font-medium italic">{selectedVenta.Usuario?.Correo || selectedVenta.Usuario?.correo}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">ID: {selectedVenta.UsuarioId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-2">Transacción</p>
                  <p className="text-sm text-gray-700 font-bold">Método: <span className="text-[#d42025]">{selectedVenta.MetodoPago?.Nombre || selectedVenta.MetodoPago?.nombre || 'Normal'}</span></p>
                  <p className="text-sm text-gray-700 font-bold">Fecha: <span>{new Date(selectedVenta.Fecha).toLocaleDateString()}</span></p>
                  <div className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(selectedVenta.Estado)}`}>
                    {selectedVenta.Estado}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-4">Artículos Adquiridos</p>
                <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3 text-left font-bold text-gray-500 text-xs">PRODUCTO</th>
                        <th className="px-5 py-3 text-center font-bold text-gray-500 text-xs w-20">CANT.</th>
                        <th className="px-5 py-3 text-right font-bold text-gray-500 text-xs">P. UNIT.</th>
                        <th className="px-5 py-3 text-right font-bold text-gray-500 text-xs">SUBTOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedVenta.Detalles.map((d, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-gray-800 font-bold">{d.Producto?.Nombre || d.Producto?.nombre || 'Producto de Repuesto'}</td>
                          <td className="px-5 py-4 text-center">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg font-black text-gray-700 text-xs">{d.Cantidad}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-500 font-medium">S/ {d.PrecioUnitario.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-black text-gray-900">S/ {(d.Cantidad * d.PrecioUnitario).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Section */}
              <div className="flex flex-col items-end pt-4">
                 <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase">Subtotal</span>
                      <span className="text-gray-700 font-black">S/ {selectedVenta.Total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase">Impuestos (0%)</span>
                      <span className="text-gray-700 font-black">S/ 0.00</span>
                    </div>
                    <div className="h-px bg-gray-100 w-full" />
                    <div className="flex justify-between items-center">
                      <span className="text-[#d42025] font-black text-lg">TOTAL FINAL</span>
                      <span className="text-3xl font-black text-gray-900 tracking-tighter italic">S/ {selectedVenta.Total.toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => window.print()} className="flex-1 rounded-xl border-2 border-gray-100 px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  IMPRIMIR
                </button>
                <button onClick={() => setShowDetails(false)} className="flex-1 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-black hover:-translate-y-1">
                  CERRAR TICKET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-modal-in { animation: modalIn 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
      `}</style>
    </div>
  );
};

export default AdminCompras;

