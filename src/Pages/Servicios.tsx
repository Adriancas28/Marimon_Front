import { useEffect, useMemo, useState } from "react";
import MainNavbar from "../components/MainNavbar";

type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
};

function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/servicios");
        if (!res.ok) throw new Error(`No se pudo obtener servicios (${res.status})`);
        const data = (await res.json()) as Servicio[];
        setServicios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  const serviciosFiltrados = useMemo(
    () => servicios.filter((s) => s.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())),
    [servicios, busqueda]
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900">
      <MainNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e11d2e]">Servicios</p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">Servicios de Marimon</h1>
              <p className="mt-2 text-sm text-slate-500">
                Lista de servicios disponibles.
              </p>
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar servicio..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#e11d2e] focus:ring-2 focus:ring-red-100 md:w-72"
            />
          </div>

          {loading && <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Cargando servicios...</div>}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>}

          {!loading && !error && (
            <div className="space-y-4">
              {serviciosFiltrados.length === 0 ? (
                <p className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No hay servicios para mostrar con ese filtro.
                </p>
              ) : (
                serviciosFiltrados.map((servicio, index) => (
                  <article
                    key={servicio.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className={`grid md:grid-cols-12 ${index % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}>
                      <div className="md:col-span-4">
                        <img
                          src={servicio.imagen || "https://via.placeholder.com/640x420?text=Servicio"}
                          alt={servicio.nombre}
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02] md:h-full"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-5 md:col-span-8 md:p-7">
                        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e11d2e]">
                          Servicio #{String(index + 1).padStart(2, "0")}
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900">{servicio.nombre}</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                          {servicio.descripcion}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Servicios;
