import MainNavbar from "../components/MainNavbar";
import { getSessionValue, getUserName } from "../utils/userSession";

function Perfil() {
  const nombre = getUserName();
  const token = getSessionValue("token");

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900">
      <MainNavbar />

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e11d2e]">Perfil</p>
          <h1 className="mt-2 text-3xl font-extrabold">Mi perfil</h1>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Nombre</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{nombre}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase text-slate-500">Estado de sesion</p>
              <p className="mt-1 text-sm text-slate-700">
                {token ? "Activa (token registrado)" : "Sin token de sesion"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;
