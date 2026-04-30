import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Usuario {
  Id: string;
  Nombre: string;
  Apellidos: string;
  Correo: string;
}

type ToastType = 'success' | 'edit' | 'delete' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal states
  const [showRegister, setShowRegister] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Form states
  const [formCorreo, setFormCorreo] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch('/api/usuario/lista');
      if (!res.ok) throw new Error();
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((u: any) => ({
        Id: u.Id ?? u.id ?? '',
        Nombre: u.Nombre ?? u.nombre ?? '',
        Apellidos: u.Apellidos ?? u.apellidos ?? '',
        Correo: u.Correo ?? u.correo ?? '',
      }));
      setUsuarios(normalized);
    } catch {
      showToast('error', 'Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  const resetForm = () => { setFormCorreo(''); setFormPassword(''); setFormNombre(''); setFormApellidos(''); };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await fetch('/api/usuario/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: formCorreo, contraseña: formPassword }),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('success', 'Usuario registrado correctamente.');
      setShowRegister(false);
      resetForm();
      fetchUsuarios();
    } catch (err: any) {
      showToast('error', err.message || 'Error al registrar usuario.');
    } finally { setFormLoading(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/usuario/${selectedUser.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: formCorreo, nombre: formNombre, apellidos: formApellidos }),
      });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('edit', 'Usuario actualizado correctamente.');
      setShowEdit(false);
      resetForm();
      fetchUsuarios();
    } catch (err: any) {
      showToast('error', err.message || 'Error al actualizar usuario.');
    } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const res = await fetch(`/api/usuario/${selectedUser.Id}`, { method: 'DELETE' });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg); }
      showToast('delete', 'Usuario eliminado correctamente.');
      setShowDelete(false);
      fetchUsuarios();
    } catch (err: any) {
      showToast('error', err.message || 'Error al eliminar usuario.');
    } finally { setFormLoading(false); }
  };

  const openEdit = (user: Usuario) => {
    setSelectedUser(user);
    setFormCorreo(user.Correo);
    setFormNombre(user.Nombre ?? '');
    setFormApellidos(user.Apellidos ?? '');
    setShowEdit(true);
  };

  const openDelete = (user: Usuario) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const filtered = usuarios.filter(u => {
    const s = search.toLowerCase();
    return (u.Correo ?? '').toLowerCase().includes(s) ||
      (u.Nombre ?? '').toLowerCase().includes(s) ||
      (u.Apellidos ?? '').toLowerCase().includes(s);
  });

  const toastColors: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    edit: 'bg-amber-500',
    delete: 'bg-red-500',
    error: 'bg-red-600',
  };

  const toastIcons: Record<ToastType, string> = {
    success: '✓',
    edit: '✎',
    delete: '✕',
    error: '⚠',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className="animate-slide-in flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 min-w-[300px]">
            <span className={`${toastColors[t.type]} flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold`}>
              {toastIcons[t.type]}
            </span>
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
          <h1 className="m-0 text-xl font-semibold">Gestión de Usuarios</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">{usuarios.length} usuarios</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/admin" className="text-gray-500 hover:text-[#d42025] transition-colors font-medium">Módulo de Administración</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-[#d42025] font-semibold">Usuarios</li>
          </ol>
        </nav>

        {/* Top bar: search + register */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Buscar por correo o nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100"
            />
          </div>
          <button
            onClick={() => { resetForm(); setShowRegister(true); }}
            className="flex items-center gap-2 rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#b81920] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Registrar nuevo usuario
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5">
          <div className="overflow-x-auto" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-5 py-3.5 text-left font-semibold">ID</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Correo</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Nombre</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Apellidos</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#d42025]" />
                      Cargando usuarios...
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-gray-400">
                    <svg className="mx-auto mb-2 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                    No se encontraron usuarios
                  </td></tr>
                ) : (
                  filtered.map((u, i) => (
                    <tr key={u.Id} className={`transition-colors hover:bg-red-50/40 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{u.Id.substring(0, 8)}...</td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{u.Correo}</td>
                      <td className="px-5 py-3.5 text-gray-600">{u.Nombre || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{u.Apellidos || '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(u)} title="Editar" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-white shadow transition hover:bg-black hover:-translate-y-0.5 hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => openDelete(u)} title="Eliminar" className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow transition hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md">
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

      {/* ===== MODAL: REGISTRAR ===== */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowRegister(false)}>
          <div className="w-full max-w-md animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Registrar nuevo usuario</h3>
              <button onClick={() => setShowRegister(false)} className="text-white/80 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" required value={formCorreo} onChange={e => setFormCorreo(e.target.value)} placeholder="correo@ejemplo.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" required value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Ingresa una contraseña"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowRegister(false)} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={formLoading} className="rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b81920] disabled:opacity-50">
                  {formLoading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: EDITAR ===== */}
      {showEdit && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowEdit(false)}>
          <div className="w-full max-w-md animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Editar usuario</h3>
              <button onClick={() => setShowEdit(false)} className="text-white/80 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input type="email" required value={formCorreo} onChange={e => setFormCorreo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" value={formNombre} onChange={e => setFormNombre(e.target.value)} placeholder="Ingresa el nombre"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Apellidos</label>
                <input type="text" value={formApellidos} onChange={e => setFormApellidos(e.target.value)} placeholder="Ingresa los apellidos"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#d42025] focus:ring-2 focus:ring-red-100" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)} className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={formLoading} className="rounded-lg bg-[#d42025] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b81920] disabled:opacity-50">
                  {formLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: ELIMINAR ===== */}
      {showDelete && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDelete(false)}>
          <div className="w-full max-w-sm animate-modal-in rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between rounded-t-xl bg-[#d42025] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
              <button onClick={() => setShowDelete(false)} className="text-white/80 hover:text-white transition-colors text-xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <p className="text-center text-gray-700 mb-1">¿Estás seguro que deseas eliminar al usuario?</p>
              <p className="text-center text-sm font-semibold text-gray-900 mb-1">{selectedUser.Correo}</p>
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

export default AdminUsuarios;
