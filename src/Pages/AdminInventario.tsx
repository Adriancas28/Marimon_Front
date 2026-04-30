import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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

  const inputCls = "w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#d42025] focus:bg-white focus:ring-4 focus:ring-red-50 font-medium";

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 min-w-[320px] border-l-4 border-l-[#d42025]">
            <span className={`${t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-500'} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold shadow-sm`}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '⚠' : 'ℹ'}
            </span>
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
          <h1 className="m-0 text-2xl font-bold tracking-tight">Control de Inventario</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/20 border border-emerald-300/30 rounded-full px-4 py-1.5 text-sm font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            {entradas.length} Entradas
          </span>
          <span className="bg-amber-500/20 border border-amber-300/30 rounded-full px-4 py-1.5 text-sm font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
            {salidas.length} Salidas
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
            <li className="text-[#d42025] font-black uppercase tracking-widest text-xs">Inventario</li>
          </ol>
        </nav>

        {/* Tabs + Search + Button */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setTab('entradas')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'entradas' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Entradas
                </span>
              </button>
              <button onClick={() => setTab('salidas')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'salidas' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>
                  Salidas
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:w-80">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Buscar por producto..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-50 bg-gray-50 px-12 py-3 text-sm outline-none transition focus:border-[#d42025] focus:bg-white focus:ring-4 focus:ring-red-50 font-medium" />
              </div>
              {/* Button: only for entradas */}
              {tab === 'entradas' && (
                <button onClick={() => { resetForm(); setShowForm(true); }}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Nueva Entrada
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLA ENTRADAS */}
        {tab === 'entradas' && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 border border-gray-100">
            <div className="overflow-x-auto" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#1c1c1c] text-white">
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">ID</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Producto</th>
                    <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-xs">Cantidad</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Proveedor</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Observaciones</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={6} className="py-24 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-emerald-500" />
                        <span className="font-bold text-gray-500 animate-pulse">Cargando entradas...</span>
                      </div>
                    </td></tr>
                  ) : filteredEntradas.length === 0 ? (
                    <tr><td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        <p className="text-xl font-bold">No hay entradas registradas</p>
                      </div>
                    </td></tr>
                  ) : (
                    filteredEntradas.map((e, i) => (
                      <tr key={e.id} className={`transition-all hover:bg-emerald-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 font-mono text-xs font-bold text-emerald-700">ENT-{e.id}</span>
                        </td>
                        <td className="px-6 py-5 font-bold text-gray-800">{e.producto?.nombre ?? '—'}</td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-black">+{e.cantidad}</span>
                        </td>
                        <td className="px-6 py-5 text-gray-600 font-medium">{e.proveedor || '—'}</td>
                        <td className="px-6 py-5 text-gray-500 text-xs max-w-[200px] truncate">{e.observaciones || '—'}</td>
                        <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap">
                          {new Date(e.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLA SALIDAS */}
        {tab === 'salidas' && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5 border border-gray-100">
            <div className="overflow-x-auto" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#1c1c1c] text-white">
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">ID</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Producto</th>
                    <th className="px-6 py-5 text-center font-bold uppercase tracking-wider text-xs">Cantidad</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Comprobante ID</th>
                    <th className="px-6 py-5 text-left font-bold uppercase tracking-wider text-xs">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={5} className="py-24 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-amber-500" />
                        <span className="font-bold text-gray-500 animate-pulse">Cargando salidas...</span>
                      </div>
                    </td></tr>
                  ) : filteredSalidas.length === 0 ? (
                    <tr><td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        <p className="text-xl font-bold">No hay salidas registradas</p>
                      </div>
                    </td></tr>
                  ) : (
                    filteredSalidas.map((s, i) => (
                      <tr key={s.id} className={`transition-all hover:bg-amber-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-lg bg-amber-50 px-2 py-1 font-mono text-xs font-bold text-amber-700">SAL-{s.id}</span>
                        </td>
                        <td className="px-6 py-5 font-bold text-gray-800">{s.producto?.nombre ?? '—'}</td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-black">-{s.cantidad}</span>
                        </td>
                        <td className="px-6 py-5 text-gray-600 font-mono text-xs">#{s.comprobanteId}</td>
                        <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap">
                          {new Date(s.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: REGISTRAR ENTRADA */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg animate-modal-in rounded-3xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-emerald-500 px-8 py-5 text-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-700" />
              <h3 className="text-xl font-black tracking-tight">Registrar Entrada</h3>
              <p className="text-emerald-100 text-sm font-medium">Ingresa los datos del nuevo ingreso al inventario</p>
            </div>
            <form onSubmit={handleRegistrarEntrada} className="p-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Producto *</label>
                <select value={fProductoId} onChange={e => setFProductoId(e.target.value)} required className={inputCls}>
                  <option value="">— Seleccionar producto —</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Cantidad *</label>
                <input type="number" min="1" required value={fCantidad} onChange={e => setFCantidad(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Proveedor</label>
                <input type="text" value={fProveedor} onChange={e => setFProveedor(e.target.value)} placeholder="Nombre del proveedor (opcional)" className={inputCls} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Observaciones</label>
                <textarea value={fObservaciones} onChange={e => setFObservaciones(e.target.value)} placeholder="Notas adicionales (opcional)" rows={2}
                  className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#d42025] focus:bg-white focus:ring-4 focus:ring-red-50 font-medium resize-none" />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border-2 border-gray-100 px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={formLoading} className="flex-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-emerald-600 hover:-translate-y-0.5 disabled:opacity-50">
                  {formLoading ? 'Registrando...' : 'Registrar Entrada'}
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
        .animate-modal-in { animation: modalIn 0.25s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
      `}</style>
    </div>
  );
};

export default AdminInventario;
