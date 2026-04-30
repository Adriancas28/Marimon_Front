import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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

  const inputCls = "w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]";

  const FormFields = () => (
    <div className="p-10 space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nombre del Producto</label>
        <input name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Ej: Amortiguador Delantero" className={inputCls} />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Descripción Técnica</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Especificaciones del producto..." rows={3}
          className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Precio Unitario (S/)</label>
          <input name="precio" type="number" step="0.01" min="0" required value={form.precio} onChange={handleChange} placeholder="0.00" className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock Inicial</label>
          <input name="stock" type="number" min="0" required value={form.stock} onChange={handleChange} placeholder="0" className={inputCls} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">URL de la Imagen</label>
        <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className={inputCls} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 min-w-[300px]">
            <span className={`${toastColors[t.type]} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold`}>{toastIcons[t.type]}</span>
            <p className="text-sm text-gray-700 font-medium">{t.message}</p>
          </div>
        ))}
      </div>

      {/* Header Unificado */}
      <div className="bg-[#d42025] text-white py-6 px-12 flex justify-between items-center shadow-xl z-10">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">GESTIÓN DE PRODUCTOS</h1>
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

      {/* Content Pantalla Completa */}
      <main className="flex-1 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Buscar por nombre o descripción..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#d42025] focus:ring-4 focus:ring-red-50" />
          </div>
          <button onClick={() => { resetForm(); setShowRegister(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-3 rounded-2xl bg-[#d42025] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-black hover:-translate-y-1">
            <i className="bi bi-plus-circle-fill text-lg"></i>
            REGISTRAR NUEVO PRODUCTO
          </button>
        </div>

        {/* Table Unificada */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">ID</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Visual</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Información del Producto</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-right">Precio Unit.</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Stock</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#d42025]" />
                        <span className="text-gray-400 font-bold text-sm tracking-widest">SINCRONIZANDO CATÁLOGO...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center opacity-20">
                      <i className="bi bi-box-seam text-7xl"></i>
                      <span className="font-black text-xl block mt-2">SIN PRODUCTOS REGISTRADOS</span>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <tr key={p.id} className={`transition-all hover:bg-red-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-6 font-mono text-[10px] text-gray-400">{p.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {p.imagen ? (
                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-md border-2 border-white group">
                              <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-125" onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=SIN+FOTO'; }} />
                            </div>
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                              <i className="bi bi-image text-3xl"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-sm">{p.nombre.toUpperCase()}</span>
                          <span className="text-xs text-slate-400 truncate max-w-[250px]">{p.descripcion || 'Sin descripción técnica'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900 text-lg">S/ {p.precio.toFixed(2)}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-tighter ${p.stock > 10 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock} UNIDADES
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => openEdit(p)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-black transition-all shadow-md hover:scale-110">
                            <i className="bi bi-pencil-square text-lg"></i>
                          </button>
                          <button onClick={() => { setSelected(p); setShowDelete(true); }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-700 transition-all shadow-md hover:scale-110">
                            <i className="bi bi-trash3-fill text-lg"></i>
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
      </main>

      {/* Footer Unificado */}
      <div className="bg-[#1c1c1c] py-6 px-12 flex justify-between items-center text-white/50 text-[10px] font-bold tracking-[0.3em] uppercase">
          <span>MARIMON ERP SYSTEM v2.0</span>
          <span>&copy; 2026 GESTIÓN DE PRODUCTOS - ACCESO RESTRINGIDO</span>
      </div>

      {/* MODAL: REGISTRAR / EDITAR */}
      {(showRegister || showEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => { setShowRegister(false); setShowEdit(false); }}>
          <div className="w-full max-w-2xl animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#d42025] px-8 py-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">{showRegister ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Información técnica y comercial</p>
              </div>
              <button onClick={() => { setShowRegister(false); setShowEdit(false); }} className="text-3xl font-black opacity-50 hover:opacity-100 transition-opacity leading-none">&times;</button>
            </div>
            <form onSubmit={showRegister ? handleRegister : handleEdit}>
              <FormFields />
              <div className="px-10 pb-10 flex gap-4">
                <button type="button" onClick={() => { setShowRegister(false); setShowEdit(false); }} className="flex-1 rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                <button type="submit" disabled={formLoading} className="flex-1 rounded-2xl bg-[#d42025] py-4 text-xs font-black text-white hover:bg-black transition-all shadow-lg shadow-red-900/20">
                  {formLoading ? 'PROCESANDO...' : (showRegister ? 'REGISTRAR PRODUCTO' : 'GUARDAR CAMBIOS')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ELIMINAR */}
      {showDelete && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowDelete(false)}>
          <div className="w-full max-w-sm animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#d42025] px-8 py-6 text-white">
              <h3 className="text-lg font-black uppercase tracking-tighter text-center">¿ELIMINAR PRODUCTO?</h3>
            </div>
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-exclamation-triangle-fill text-4xl"></i>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight">{selected.nombre}</p>
              <p className="text-xs text-slate-400 mb-8">Esta acción retirará el producto del catálogo permanentemente.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} disabled={formLoading} className="w-full rounded-2xl bg-red-500 py-4 text-xs font-black text-white hover:bg-red-700 transition-all">
                  {formLoading ? 'ELIMINANDO...' : 'SÍ, ELIMINAR PRODUCTO'}
                </button>
                <button onClick={() => setShowDelete(false)} className="w-full rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
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

export default AdminProductos;
