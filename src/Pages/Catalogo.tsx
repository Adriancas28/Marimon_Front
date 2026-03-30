import MainNavbar from "../components/MainNavbar";
import { Link } from "react-router-dom";

function Catalogo() {
  type ProductoMock = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    fechaCreacion: string | null;
    fechaActualizacion: string | null;
    alto: string;
  };

  const productosMock = [
    {
      id: 1,
      nombre: "Filtro de aceite premium",
      descripcion: "Compatible con motores 1.6L y 2.0L. Mejora la retencion de impurezas.",
      precio: 49.9,
      stock: 28,
      imagen: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-20T10:00:00Z",
      fechaActualizacion: "2026-03-26T14:00:00Z",
      alto: "h-56",
    },
    {
      id: 2,
      nombre: "Pastillas de freno delanteras",
      descripcion: "Compuesto ceramico de larga duracion para frenado estable en ciudad.",
      precio: 189.0,
      stock: 16,
      imagen: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-18T09:15:00Z",
      fechaActualizacion: "2026-03-26T09:45:00Z",
      alto: "h-64",
    },
    {
      id: 3,
      nombre: "Bateria 12V 65Ah",
      descripcion: "Alto rendimiento para arranque en frio y sistemas electricos exigentes.",
      precio: 459.0,
      stock: 9,
      imagen: "https://images.unsplash.com/photo-1603539444875-76e7684265b3?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-12T11:30:00Z",
      fechaActualizacion: null,
      alto: "h-48",
    },
    {
      id: 4,
      nombre: "Amortiguador trasero",
      descripcion: "Mayor estabilidad en curvas y mejor absorcion de impactos.",
      precio: 329.5,
      stock: 14,
      imagen: "https://images.unsplash.com/photo-1635865165118-917ed9e20936?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-10T08:20:00Z",
      fechaActualizacion: "2026-03-22T13:10:00Z",
      alto: "h-72",
    },
    {
      id: 5,
      nombre: "Kit de limpieza de inyectores",
      descripcion: "Reduce residuos y mejora la combustion para un consumo mas eficiente.",
      precio: 99.0,
      stock: 32,
      imagen: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-17T15:00:00Z",
      fechaActualizacion: null,
      alto: "h-52",
    },
    {
      id: 6,
      nombre: "Juego de bujias iridium",
      descripcion: "Encendido mas preciso y mayor vida util en motores a gasolina.",
      precio: 139.9,
      stock: 21,
      imagen: "https://images.unsplash.com/photo-1671212213136-a2d53e3c8bbf?q=80&w=1200&auto=format&fit=crop",
      fechaCreacion: "2026-03-19T12:40:00Z",
      fechaActualizacion: "2026-03-25T17:25:00Z",
      alto: "h-60",
    },
  ] satisfies ProductoMock[];

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900">
      <MainNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <section className="rounded-2xl border border-[#e4e4df] bg-white p-6 md:p-8">
          <div className="mb-8 border-b border-[#e8e8e2] pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b5f3a]">
              Catalogo
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1b1b1b] md:text-4xl">
              Productos destacados
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[#5a5a52]">
              Lista de productos destacados.
            </p>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 xl:columns-4">
            {productosMock.map((producto) => (
              <article
                key={producto.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-[#e8e8e2] bg-white transition hover:shadow-md"
              >
                <div className={`${producto.alto} bg-[#f1f2ed]`} />
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-[#6e6e65]">Producto automotriz</p>
                  <h2 className="mt-1 text-sm font-semibold text-[#1f1f1a]">{producto.nombre}</h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#66665d]">
                    {producto.descripcion}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-semibold text-[#0b5f3a]">
                      S/ {producto.precio.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#66665d]">Stock: {producto.stock}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button className="flex-1 rounded-md border border-[#0b5f3a] px-2.5 py-1.5 text-xs font-semibold text-[#0b5f3a] transition hover:bg-[#0b5f3a] hover:text-white">
                      Ver
                    </button>
                    <Link to="/pago" className="flex-2 rounded-md bg-[#0b5f3a] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#084b2e] shadow-sm flex items-center justify-center gap-1">
                      <i className="bi bi-cart-plus"></i> Añadir
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Catalogo;