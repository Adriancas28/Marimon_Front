import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
}

type ToastType = 'success' | 'edit' | 'delete' | 'error';
interface Toast { id: number; type: ToastType; message: string; }

const emptyForm = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '' };

const AdminProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Producto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchProductos = useCallback(async () => {
    try {
      const res = await fetch('/api/producto');
      if (!res.ok) throw new Error();
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data?.content ?? data?.data ?? []);
      setProductos(arr.map((p: any) => ({
        id: p.id ?? p.Id ?? 0,
        nombre: p.nombre ?? p.Nombre ?? '',
        descripcion: p.descripcion ?? p.Descripcion ?? '',
        precio: Number(p.precio ?? p.Precio) || 0,
        stock: Number(p.stock ?? p.Stock) || 0,
        imagen: p.imagen ?? p.Imagen ?? '',
      })));
    } catch {
      showToast('error', 'Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const resetForm = () => setForm(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const buildBody = () => ({
    nombre: form.nombre,
    descripcion: form.descripcion,
    precio: parseFloat(form.precio) || 0,
    stock: parseInt(form.stock) || 0,
    imagen: form.imagen,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch('/api/producto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody()),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('success', 'Producto registrado correctamente.');
      setShowRegister(false); resetForm(); fetchProductos();
    } catch (err: any) {
      showToast('error', err.message || 'Error al registrar producto.');
    } finally { setFormLoading(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/producto/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody()),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('edit', 'Producto actualizado correctamente.');
      setShowEdit(false); resetForm(); fetchProductos();
    } catch (err: any) {
      showToast('error', err.message || 'Error al actualizar producto.');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/producto/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('delete', 'Producto eliminado correctamente.');
      setShowDelete(false); fetchProductos();
    } catch (err: any) {
      showToast('error', err.message || 'Error al eliminar producto.');
    } finally { setFormLoading(false); }
  };

  const openEdit = (p: Producto) => {
    setSelected(p);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: String(p.precio), stock: String(p.stock), imagen: p.imagen });
    setShowEdit(true);
  };

  const filtered = productos.filter(p => {
    const s = search.toLowerCase();
    return (p.nombre ?? '').toLowerCase().includes(s) || (p.descripcion ?? '').toLowerCase().includes(s);
  });

  const toastColors: Record<ToastType, string> = { success: 'bg-emerald-500', edit: 'bg-amber-500', delete: 'bg-red-500', error: 'bg-red-600' };
  const toastIcons: Record<ToastType, string> = { success: '✓', edit: '✎', delete: '✕', error: '⚠' };

  const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100";

  const FormFields = () => (
    <div className="p-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre</label>
        <input name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del producto" rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Precio (S/)</label>
          <input name="precio" type="number" step="0.01" min="0" required value={form.precio} onChange={handleChange} placeholder="0.00" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Stock</label>
          <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} placeholder="0" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">URL de Imagen</label>
        <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." className={inputCls} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 min-w-[300px]">
            <span className={`${toastColors[t.type]} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold`}>{toastIcons[t.type]}</span>
            <p className="text-sm text-gray-700 font-medium">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-[#d42025] text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Volver
          </Link>
          <div className="h-6 w-px bg-white/30" />
          <h1 className="m-0 text-xl font-semibold">Gestión de Productos</h1>
        </div>
        <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">{productos.length} productos</span>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/admin" className="text-gray-500 hover:text-[#d42025] transition-colors font-medium">Módulo de Administración</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-[#d42025] font-semibold">Productos</li>
          </ol>
        </nav>

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar por nombre o descripción..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
          </div>
          <button onClick={() => { resetForm(); setShowRegister(true); }}
            className="flex items-center gap-2 rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#b81920] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Registrar nuevo producto
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5">
          <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-4 py-3.5 text-left font-semibold">ID</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Imagen</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3.5 text-left font-semibold">Descripción</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Precio</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Stock</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#d42025]" />
                      Cargando productos...
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">
                    <svg className="mx-auto mb-2 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    No se encontraron productos
                  </td></tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr key={p.id} className={`transition-colors hover:bg-red-50/40 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                      <td className="px-4 py-3">
                        {p.imagen ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg shadow group">
                            <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover transition group-hover:scale-110" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=N/A'; }} />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{p.nombre}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[220px] truncate">{p.descripcion || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">S/ {p.precio.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)} title="Editar" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-white shadow transition hover:bg-black hover:-translate-y-0.5 hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => { setSelected(p); setShowDelete(true); }} title="Eliminar" className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow transition hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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

      {/* MODAL: REGISTRAR */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowRegister(false)}>
          <div className="w-full max-w-lg animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Registrar nuevo producto</h3>
              <button onClick={() => setShowRegister(false)} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleRegister}>
              <FormFields />
              <div className="flex justify-end gap-3 px-6 pb-6">
                <button type="button" onClick={() => setShowRegister(false)} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={formLoading} className="rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b81920] disabled:opacity-50">
                  {formLoading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEdit(false)}>
          <div className="w-full max-w-lg animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Editar producto</h3>
              <button onClick={() => setShowEdit(false)} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEdit}>
              <FormFields />
              <div className="flex justify-end gap-3 px-6 pb-6">
                <button type="button" onClick={() => setShowEdit(false)} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={formLoading} className="rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b81920] disabled:opacity-50">
                  {formLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR */}
      {showDelete && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDelete(false)}>
          <div className="w-full max-w-sm animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
              <button onClick={() => setShowDelete(false)} className="text-white/80 hover:text-white text-xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <p className="text-center text-gray-700 mb-1">¿Deseas eliminar este producto?</p>
              <p className="text-center text-sm font-semibold text-gray-900 mb-1">{selected.nombre}</p>
              <p className="text-center text-xs text-gray-400">Esta acción no se puede deshacer.</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setShowDelete(false)} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300">Cancelar</button>
                <button onClick={handleDelete} disabled={formLoading} className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50">
                  {formLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .animate-modal-in { animation: modalIn 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminProductos;
