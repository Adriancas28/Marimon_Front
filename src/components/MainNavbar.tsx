import { Link, NavLink } from "react-router-dom";
import { getUserName } from "../utils/userSession";

function MainNavbar() {
  const userName = getUserName();

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/inicio" className="text-xl font-extrabold uppercase tracking-wide text-[#e11d2e]">
          Marimon
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <NavLink to="/inicio" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            INICIO
          </NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            CATALOGO
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            SERVICIOS
          </NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => (isActive ? "text-[#e11d2e]" : "transition hover:text-[#e11d2e]")}>
            NOSOTROS
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 sm:inline">
            {userName}
          </span>
          <Link to="/perfil" className="rounded-lg bg-[#e11d2e] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#be1020]">
            Ver mi perfil
          </Link>
        </div>
      </div>
    </header>
  );
}

export default MainNavbar;
