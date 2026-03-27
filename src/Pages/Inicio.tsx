import MainNavbar from "../components/MainNavbar";

function Inicio() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900">
      <MainNavbar />

      <section className="relative">
        <img
          src="/images/login.jpeg"
          alt="Marimon"
          className="h-[260px] w-full object-cover md:h-[380px]"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-center px-4 md:px-8">
          <div className="max-w-2xl rounded-2xl border border-white/20 bg-black/55 p-6 backdrop-blur-sm md:p-8">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Bienvenidos a <span className="text-[#ff3347]">Marimon Perú</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-100 md:text-base">
              Empresa especializada en servicios automotrices, mantenimiento y
              soluciones de calidad para tu vehiculo.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Mision</h2>
            <p className="mt-2 text-sm text-slate-600">
              Brindar servicios confiables con enfoque tecnico y atencion cercana.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Vision</h2>
            <p className="mt-2 text-sm text-slate-600">
              Ser referente nacional en calidad de servicio automotriz.
            </p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Valores</h2>
            <p className="mt-2 text-sm text-slate-600">
              Compromiso, transparencia, calidad y trabajo en equipo.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Inicio;
