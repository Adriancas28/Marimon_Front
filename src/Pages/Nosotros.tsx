import MainNavbar from "../components/MainNavbar";

function Nosotros() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900">
      <MainNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <section className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e11d2e]">Nosotros</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Sobre Marimon</h1>
          <p className="mt-5 text-slate-600">
            Marimon es una empresa peruana orientada al servicio automotriz profesional.
            Trabajamos con procesos estandarizados, equipos especializados y un enfoque
            de mejora continua para entregar resultados de calidad.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold">Nuestra historia</h2>
              <p className="mt-2 text-sm text-slate-600">
                Nacimos con la vision de ofrecer un servicio tecnico confiable, cercano
                y transparente para conductores y empresas.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold">Nuestro equipo</h2>
              <p className="mt-2 text-sm text-slate-600">
                Contamos con personal capacitado que prioriza la seguridad, el detalle
                tecnico y la buena atencion al cliente.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Nosotros;
