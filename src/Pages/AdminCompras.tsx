import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

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
      case 'completado': return 'bg-emerald-100 text-emerald-700';
      case 'pendiente': return 'bg-amber-100 text-amber-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 min-w-[320px]">
            <span className={`${toastColors[t.type]} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold`}>{toastIcons[t.type]}</span>
            <p className="text-sm text-gray-700 font-bold">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Header Unificado */}
      <div className="bg-[#d42025] text-white py-6 px-12 flex justify-between items-center shadow-xl z-10">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">HISTORIAL DE VENTAS</h1>
            <p className="text-red-100 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Marimon Perú - Administración</p>
          </div>
          <div className="h-10 w-px bg-white/20 hidden md:block"></div>
          <Link to="/admin" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            <i className="bi bi-arrow-left-circle-fill text-lg"></i>
            VOLVER AL PANEL
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 bg-white text-[#d42025] hover:bg-black hover:text-white transition-all px-8 py-3 rounded-full text-sm font-black shadow-lg"
        >
          <i className="bi bi-power text-lg"></i>
          SALIR DEL SISTEMA
        </button>
      </div>

      {/* Main Content Pantalla Completa */}
      <main className="flex-1 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Buscar por cliente, ID o estado..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#d42025] focus:ring-4 focus:ring-red-50" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <button onClick={fetchVentas} className="flex-1 md:flex-none flex items-center justify-center gap-3 rounded-2xl bg-[#1c1c1c] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-black hover:-translate-y-1">
                <i className="bi bi-arrow-clockwise text-lg"></i>
                ACTUALIZAR LISTA
             </button>
          </div>
        </div>

        {/* Table Unificada */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Nro. Orden</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Fecha y Hora</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-right">Monto Total</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Estado</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#d42025]" />
                        <span className="text-gray-400 font-bold text-sm tracking-widest">CARGANDO HISTORIAL...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center opacity-20">
                      <i className="bi bi-cart-x text-7xl"></i>
                      <span className="font-black text-xl block mt-2">NO SE ENCONTRARON VENTAS</span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((v, i) => (
                    <tr key={v.Id} className={`transition-all hover:bg-red-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-400 text-[11px] border border-gray-100 px-3 py-1 rounded-lg bg-white shadow-sm italic">ORD-{v.Id.toString().padStart(5, '0')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm">{new Date(v.Fecha).toLocaleDateString('es-PE')}</span>
                          <span className="text-[10px] text-slate-400 font-black">{new Date(v.Fecha).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm uppercase">{v.Usuario?.Nombre || v.Usuario?.nombre || 'CLIENTE MARIMON'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{v.Usuario?.Correo || v.Usuario?.correo || '---'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">S/ {v.Total.toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(v.Estado)}`}>
                          {v.Estado}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button onClick={() => { setSelectedVenta(v); setShowDetails(true); }} className="bg-[#d42025] text-white px-6 py-2.5 rounded-2xl text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-red-900/20 active:scale-95">
                          VER TICKET
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer Unificado */}
      <div className="bg-[#1c1c1c] py-6 px-12 flex justify-between items-center text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase">
          <span>MARIMON ERP SYSTEM v2.0</span>
          <span>&copy; 2026 HISTORIAL DE VENTAS - ACCESO RESTRINGIDO</span>
      </div>

      {/* MODAL: DETALLES (Ticket) */}
      {showDetails && selectedVenta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowDetails(false)}>
          <div className="w-full max-w-2xl animate-modal-in rounded-[40px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1c1c1c] px-10 py-8 text-white relative border-b-4 border-[#d42025]">
               <h3 className="text-2xl font-black tracking-tight">RESUMEN DE TRANSACCIÓN</h3>
               <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.4em]">Marimon Perú | ID: {selectedVenta.Id}</p>
               <button onClick={() => setShowDetails(false)} className="absolute top-8 right-8 text-3xl font-light opacity-50 hover:opacity-100 transition-opacity">&times;</button>
            </div>
            
            <div className="p-10">
               <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b-2 border-dashed border-gray-100">
                  <div className="space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cliente Solicitante</p>
                        <p className="font-black text-slate-800 text-lg uppercase">{selectedVenta.Usuario?.Nombre || selectedVenta.Usuario?.nombre || 'Invitado'}</p>
                        <p className="text-xs font-bold text-slate-400">{selectedVenta.Usuario?.Correo || selectedVenta.Usuario?.correo}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Método de Pago</p>
                        <p className="text-sm font-black text-[#d42025] uppercase italic">{selectedVenta.MetodoPago?.Nombre || selectedVenta.MetodoPago?.nombre || 'Normal'}</p>
                     </div>
                  </div>
                  <div className="text-right space-y-4">
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha de Operación</p>
                        <p className="font-black text-slate-800">{new Date(selectedVenta.Fecha).toLocaleDateString()}</p>
                        <p className="text-[10px] font-bold text-slate-400">{new Date(selectedVenta.Fecha).toLocaleTimeString()}</p>
                     </div>
                     <div>
                        <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-tighter ${getStatusColor(selectedVenta.Estado)}`}>
                          ESTADO: {selectedVenta.Estado}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detalle de Autopartes</p>
                  <div className="rounded-3xl border-2 border-gray-50 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Descripción</th>
                          <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase">Cant</th>
                          <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedVenta.Detalles.map((d, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 font-bold text-slate-800">{d.Producto?.Nombre || d.Producto?.nombre || '---'}</td>
                            <td className="px-6 py-4 text-center"><span className="bg-gray-100 px-3 py-1 rounded-lg font-black text-slate-600">{d.Cantidad}</span></td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">S/ {(d.Cantidad * d.PrecioUnitario).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>

               <div className="mt-10 flex justify-between items-center bg-gray-50 p-8 rounded-[32px]">
                  <span className="text-[#d42025] font-black tracking-widest uppercase text-xs">Monto Total Liquidado</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">S/ {selectedVenta.Total.toFixed(2)}</span>
               </div>

               <div className="mt-10 flex gap-4">
                  <button onClick={() => window.print()} className="flex-1 rounded-2xl bg-slate-800 text-white py-4 text-xs font-black hover:bg-black transition-all">IMPRIMIR TICKET</button>
                  <button onClick={() => setShowDetails(false)} className="flex-1 rounded-2xl bg-[#d42025] text-white py-4 text-xs font-black hover:bg-black transition-all shadow-lg shadow-red-900/20">CERRAR DETALLES</button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-modal-in { animation: modalIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default AdminCompras;
