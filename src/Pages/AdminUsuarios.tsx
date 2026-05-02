import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
      const res = await fetch(`/api/usuario/${encodeURIComponent(selectedUser.Id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Correo: formCorreo,
          Nombre: formNombre,
          Apellidos: formApellidos,
          Contraseña: '',
        }),
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
      const res = await fetch(`/api/usuario/${encodeURIComponent(selectedUser.Id)}`, { method: 'DELETE' });
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
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

      {/* Header Unificado (Igual al Dashboard) */}
      <div className="bg-[#d42025] text-white py-6 px-12 flex justify-between items-center shadow-xl z-10">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">GESTIÓN DE USUARIOS</h1>
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

      {/* Main Content (Pantalla Completa) */}
      <main className="flex-1 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="relative w-full md:w-96">
            <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-[#d42025] focus:ring-4 focus:ring-red-50"
            />
          </div>
          <button
            onClick={() => { resetForm(); setShowRegister(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-3 rounded-2xl bg-[#d42025] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:bg-black hover:-translate-y-1"
          >
            <i className="bi bi-person-plus-fill text-lg"></i>
            REGISTRAR NUEVO USUARIO
          </button>
        </div>

        {/* Table Unificada */}
        <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1c1c1c] text-white">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">ID de Registro</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Correo Electrónico</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Nombres</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest">Apellidos</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-center">Acciones de Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-100 border-t-[#d42025]" />
                        <span className="text-gray-400 font-bold text-sm tracking-widest">SINCRONIZANDO DATOS...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-20">
                         <i className="bi bi-people text-7xl"></i>
                         <span className="font-black text-xl">NO HAY REGISTROS</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => (
                    <tr key={u.Id} className={`transition-all hover:bg-red-50/30 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-8 py-6 font-mono text-[10px] text-gray-400">ID-{u.Id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-8 py-6 font-bold text-slate-800">{u.Correo}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{u.Nombre || '---'}</td>
                      <td className="px-8 py-6 text-slate-600 font-medium">{u.Apellidos || '---'}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => openEdit(u)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white hover:bg-black transition-all shadow-md hover:scale-110">
                            <i className="bi bi-pencil-square text-lg"></i>
                          </button>
                          <button onClick={() => openDelete(u)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-700 transition-all shadow-md hover:scale-110">
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
          <span>&copy; 2026 GESTIÓN DE USUARIOS - ACCESO RESTRINGIDO</span>
      </div>

      {/* Modals con el nuevo estilo corporativo */}
      {showRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowRegister(false)}>
          <div className="w-full max-w-lg animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#d42025] px-8 py-6 text-white">
              <h3 className="text-xl font-black tracking-tight">NUEVO USUARIO</h3>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Creación de credenciales de acceso</p>
            </div>
            <form onSubmit={handleRegister} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Correo de Acceso</label>
                <input type="email" required value={formCorreo} onChange={e => setFormCorreo(e.target.value)} placeholder="ejemplo@marimon.com"
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contraseña Temporal</label>
                <input type="password" required value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowRegister(false)} className="flex-1 rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                <button type="submit" disabled={formLoading} className="flex-1 rounded-2xl bg-[#d42025] py-4 text-xs font-black text-white hover:bg-black transition-all shadow-lg shadow-red-900/20">
                  {formLoading ? 'PROCESANDO...' : 'CREAR USUARIO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => { setShowEdit(false); resetForm(); }}>
          <div className="w-full max-w-lg animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#d42025] px-8 py-6 text-white">
              <h3 className="text-xl font-black tracking-tight">EDITAR USUARIO</h3>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">ID: {selectedUser.Id.substring(0, 8)}…</p>
            </div>
            <form onSubmit={handleEdit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Correo</label>
                <input type="email" required value={formCorreo} onChange={e => setFormCorreo(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nombres</label>
                <input type="text" required value={formNombre} onChange={e => setFormNombre(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Apellidos</label>
                <input type="text" required value={formApellidos} onChange={e => setFormApellidos(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-100 px-5 py-4 text-sm font-bold outline-none transition-all focus:border-[#d42025]" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowEdit(false); resetForm(); }} className="flex-1 rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                <button type="submit" disabled={formLoading} className="flex-1 rounded-2xl bg-[#d42025] py-4 text-xs font-black text-white hover:bg-black transition-all shadow-lg shadow-red-900/20">
                  {formLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDelete && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setShowDelete(false)}>
          <div className="w-full max-w-md animate-modal-in rounded-[32px] bg-white overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-red-600 px-8 py-6 text-white">
              <h3 className="text-xl font-black tracking-tight">ELIMINAR USUARIO</h3>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Esta acción no se puede deshacer</p>
            </div>
            <div className="p-10 space-y-6">
              <p className="text-sm text-gray-600">
                ¿Seguro que deseas eliminar a <strong className="text-gray-900">{selectedUser.Correo}</strong>?
              </p>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowDelete(false)} className="flex-1 rounded-2xl bg-gray-100 py-4 text-xs font-black text-gray-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                <button type="button" onClick={handleDelete} disabled={formLoading} className="flex-1 rounded-2xl bg-red-600 py-4 text-xs font-black text-white hover:bg-red-800 transition-all">
                  {formLoading ? 'ELIMINANDO...' : 'ELIMINAR'}
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
        .animate-modal-in { animation: modalIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
};

export default AdminUsuarios;
