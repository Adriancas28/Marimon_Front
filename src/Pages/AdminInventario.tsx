import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Producto { id: number; nombre: string; }

interface Entrada {
  id: number; fecha: string; cantidad: number;
  productoId: number; producto?: Producto;
  proveedor?: string; observaciones?: string;
}

interface Salida {
  id: number; fecha: string; cantidad: number;
  productoId: number; producto?: Producto;
  comprobanteId: number;
}

type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; type: ToastType; message: string; }

type Tab = 'entradas' | 'salidas';

const n = (v: any, ...keys: string[]) => {
  for (const k of keys) { if (v?.[k] != null) return v[k]; }
  return null;
};

const AdminInventario = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('entradas');
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [fProductoId, setFProductoId] = useState('');
  const [fCantidad, setFCantidad] = useState('1');
  const [fProveedor, setFProveedor] = useState('');
  const [fObservaciones, setFObservaciones] = useState('');

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

  const fetchEntradas = useCallback(async () => {
    try {
      const res = await fetch('/api/inventario/entradas');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntradas((Array.isArray(data) ? data : []).map((e: any) => ({
        id: n(e, 'id', 'Id'), fecha: n(e, 'fecha', 'Fecha'),
        cantidad: n(e, 'cantidad', 'Cantidad'),
        productoId: n(e, 'productoId', 'ProductoId'),
        producto: e.producto ?? e.Producto ? {
          id: n(e.producto ?? e.Producto, 'id', 'Id'),
          nombre: n(e.producto ?? e.Producto, 'nombre', 'Nombre') ?? 'Sin nombre'
        } : undefined,
        proveedor: n(e, 'proveedor', 'Proveedor') ?? '',
        observaciones: n(e, 'observaciones', 'Observaciones') ?? '',
      })));
    } catch { showToast('error', 'Error al cargar entradas.'); }
  }, [showToast]);

  const fetchSalidas = useCallback(async () => {
    try {
      const res = await fetch('/api/inventario/salidas');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSalidas((Array.isArray(data) ? data : []).map((s: any) => ({
        id: n(s, 'id', 'Id'), fecha: n(s, 'fecha', 'Fecha'),
        cantidad: n(s, 'cantidad', 'Cantidad'),
        productoId: n(s, 'productoId', 'ProductoId'),
        producto: s.producto ?? s.Producto ? {
          id: n(s.producto ?? s.Producto, 'id', 'Id'),
          nombre: n(s.producto ?? s.Producto, 'nombre', 'Nombre') ?? 'Sin nombre'
        } : undefined,
        comprobanteId: n(s, 'comprobanteId', 'ComprobanteId'),
      })));
    } catch { showToast('error', 'Error al cargar salidas.'); }
  }, [showToast]);

  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetch('/api/producto');
      if (!res.ok) throw new Error();
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);
      setProductos(arr.map((p: any) => ({
        id: n(p, 'id', 'Id'), nombre: n(p, 'nombre', 'Nombre') ?? ''
      })));
    } catch { /* silenciar */ }
  }, []);

  useEffect(() => {
    Promise.all([fetchEntradas(), fetchSalidas(), fetchProductos()]).finally(() => setLoading(false));
  }, [fetchEntradas, fetchSalidas, fetchProductos]);

  const resetForm = () => { setFProductoId(''); setFCantidad('1'); setFProveedor(''); setFObservaciones(''); };

  const handleRegistrarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fProductoId) { showToast('error', 'Selecciona un producto.'); return; }
    setFormLoading(true);
    try {
      const res = await fetch('/api/inventario/entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: parseInt(fProductoId),
          cantidad: parseInt(fCantidad) || 1,
          proveedor: fProveedor || null,
          observaciones: fObservaciones || null,
        }),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('success', 'Entrada registrada correctamente.');
      setShowForm(false); resetForm();
      fetchEntradas(); fetchProductos();
    } catch (err: any) {
      showToast('error', err.message || 'Error al registrar entrada.');
    } finally { setFormLoading(false); }
  };

  const filteredEntradas = entradas.filter(e => {
    const s = search.toLowerCase();
    return (e.producto?.nombre ?? '').toLowerCase().includes(s) ||
      (e.proveedor ?? '').toLowerCase().includes(s);
  });

  const filteredSalidas = salidas.filter(s => {
    const q = search.toLowerCase();
    return (s.producto?.nombre ?? '').toLowerCase().includes(q);
  });

  const inputCls = "w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 min-w-[320px]">
            <span className={`${t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-500'} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm`}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '⚠' : 'ℹ'}
            </span>
            <p className="text-sm text-gray-700 font-bold">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Header Unificado */}
      <div className="bg-[#d42025] text-white py-6 px-12 flex justify-between items-center shadow-xl z-10">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">CONTROL DE INVENTARIO</h1>
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          {/* Tabs Corporativas */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-md border border-gray-100">
            <button onClick={() => setTab('entradas')}
              className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'entradas' ? 'bg-[#d42025] text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-[#d42025]'}`}>
              Entradas
            </button>
            <button onClick={() => setTab('salidas')}
              className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'salidas' ? 'bg-[#d42025] text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-[#d42025]'}`}>
              Salidas
            </button>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-96">
              <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="Buscar movimientos por producto..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#d42025] focus:ring-4 focus:ring-red-50" />
            </div>
            {tab === 'entradas' && (
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-emerald-600 hover:-translate-y-1">
                <i className="bi bi-plus-circle-fill text-lg"></i>
                NUEVA ENTRADA
              </button>
            )}
          </div>
        </div>

        {/* Table Unificada */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">ID Movimiento</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Descripción del Producto</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Cantidad</th>
                  {tab === 'entradas' ? (
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Proveedor / Notas</th>
                  ) : (
                    <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Referencia Venta</th>
                  )}
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#d42025]" />
                        <span className="text-gray-400 font-bold text-sm tracking-widest">CONSULTANDO ALMACÉN...</span>
                      </div>
                    </td>
                  </tr>
                ) : (tab === 'entradas' ? filteredEntradas : filteredSalidas).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center opacity-20">
                      <i className="bi bi-shuffle text-7xl"></i>
                      <span className="font-black text-xl block mt-2 uppercase tracking-tighter">SIN MOVIMIENTOS REGISTRADOS</span>
                    </td>
                  </tr>
                ) : (
                  (tab === 'entradas' ? filteredEntradas : filteredSalidas).map((m, i) => (
                    <tr key={m.id} className={`transition-all hover:bg-gray-50/50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}>
                      <td className="px-8 py-6 font-black text-slate-400 text-[11px]">
                         <span className={`px-3 py-1 rounded-lg border border-gray-100 shadow-sm ${tab === 'entradas' ? 'text-emerald-600' : 'text-amber-600'}`}>
                           {tab === 'entradas' ? 'ENT-' : 'SAL-'}{m.id}
                         </span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-800 text-sm uppercase">{(m as any).producto?.nombre || 'Producto No Identificado'}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[11px] font-black uppercase tracking-widest ${tab === 'entradas' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {tab === 'entradas' ? '+' : '-'}{m.cantidad} UNID.
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {tab === 'entradas' ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-600 text-xs uppercase italic">{(m as Entrada).proveedor || 'S/ PROVEEDOR'}</span>
                            <span className="text-[10px] text-slate-400">{(m as Entrada).observaciones || 'Sin notas adicionales'}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-500 text-xs uppercase tracking-tighter">COMPROBANTE: #{(m as Salida).comprobanteId}</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-800 text-sm">{new Date(m.fecha).toLocaleDateString()}</span>
                           <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{new Date(m.fecha).toLocaleTimeString()}</span>
                         </div>
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
          <span>&copy; 2026 CONTROL DE INVENTARIO - ACCESO RESTRINGIDO</span>
      </div>

      {/* MODAL: REGISTRAR ENTRADA */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-500 px-8 py-6 text-white border-b-4 border-emerald-700">
              <h3 className="text-xl font-black tracking-tight">INGRESAR STOCK</h3>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Documentación de entrada al almacén</p>
            </div>
            <form onSubmit={handleRegistrarEntrada} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Seleccionar Producto</label>
                <select value={fProductoId} onChange={e => setFProductoId(e.target.value)} required className={inputCls}>
                  <option value="">--- Seleccionar ---</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cantidad Entrante</label>
                <input type="number" min="1" required value={fCantidad} onChange={e => setFCantidad(e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Proveedor de Origen</label>
                <input type="text" value={fProveedor} onChange={e => setFProveedor(e.target.value)} placeholder="Ej: Importadora Marimon" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Observaciones de Entrega</label>
                <textarea value={fObservaciones} onChange={e => setFObservaciones(e.target.value)} placeholder="..." rows={2}
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-emerald-500 resize-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                <button type="submit" disabled={formLoading} className="flex-1 rounded-2xl bg-emerald-500 py-4 text-xs font-black text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20">
                  {formLoading ? 'PROCESANDO...' : 'REGISTRAR INGRESO'}
                </button>
              </div>
            </form>
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

export default AdminInventario;
