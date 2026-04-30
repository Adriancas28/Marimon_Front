import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

const slides = [
  { img: "/images/slider-01.jpg", title: "Tecnología Automotriz", sub: "Expertos en diagnóstico" },
  { img: "/images/slider-02.jpg", title: "Mantenimiento Preventivo", sub: "Cuidamos tu motor" },
  { img: "/images/slider-03.jpg", title: "Repuestos Originales", sub: "Garantía de calidad" },
];

function Inicio() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Lógica del Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <MainNavbar />

      {/* Success Message (Alert) */}
      {showSuccess && (
        <div className="fixed bottom-5 right-5 z-[1050] max-w-xs w-full bg-green-500 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <i className="bi bi-check-circle-fill text-xl"></i>
            <span className="font-bold text-sm">Operación completada con éxito</span>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-white/80 hover:text-white">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}

      {/* Slider Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover brightness-[0.6]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
               <h1 className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl translate-y-[-20px] animate-fadeIn">
                 {slide.title}
               </h1>
               <p className="text-xl md:text-2xl text-white/90 font-medium tracking-wide animate-fadeIn delay-300">
                 {slide.sub}
               </p>
            </div>
          </div>
        ))}
        
        {/* Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#E42229] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <i className="bi bi-chevron-left text-2xl"></i>
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#E42229] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <i className="bi bi-chevron-right text-2xl"></i>
        </button>
      </section>

      {/* Welcome Section */}
      <section className="bg-[#111] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 overflow-hidden rounded-3xl shadow-2xl border-4 border-white/5">
            <img src="/images/bienvenidos.jpg" alt="Bienvenidos" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-full md:w-1/2 text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              BIENVENIDOS <br />
              <span className="text-[#E42229]">A MARIMON PERÚ</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Desde hace 50 años nos consideramos expertos en el tema; estamos siempre acompañados por el personal
              más eficiente, profesional y oportuno para brindarte la satisfacción que mereces.
            </p>
            <Link to="/servicios" className="inline-block bg-[#E42229] text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-red-900/40 hover:bg-white hover:text-black transition-all transform hover:-translate-y-1">
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Services Links Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/servicios" className="group relative h-[350px] rounded-3xl overflow-hidden shadow-xl">
            <img src="/images/servicios.jpg" alt="Servicios" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
               <h3 className="text-3xl font-black text-white border-b-4 border-[#E42229] pb-2">SERVICIOS</h3>
            </div>
          </Link>
          <Link to="/catalogo" className="group relative h-[350px] rounded-3xl overflow-hidden shadow-xl">
            <img src="/images/tienda.jpg" alt="Tienda Online" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
               <h3 className="text-3xl font-black text-white border-b-4 border-[#E42229] pb-2">TIENDA ONLINE</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-16">
          ¿POR QUÉ SOMOS <span className="text-[#E42229]">LA MEJOR OPCIÓN?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { id: 1, title: "INNOVACIÓN", img: "/images/icono_innovacion.jpg", desc: "Tecnología de punta para diagnosticar su vehículo con precisión." },
            { id: 2, title: "SEGURIDAD", img: "/images/icono_security.jpg", desc: "Marcas certificadas y garantía en todas nuestras reparaciones." },
            { id: 3, title: "COSTOS", img: "/images/icono_economia.jpg", desc: "Precios competitivos sin sacrificar la calidad." },
            { id: 4, title: "EFICIENCIA", img: "/images/icono_eficiencia.jpg", desc: "Entregamos su vehículo en el tiempo prometido." },
          ].map((item) => (
            <div key={item.id} className="group flex flex-col items-center">
              <div className="relative w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-lg transition-all group-hover:bg-[#E42229]/10 group-hover:-translate-y-2">
                <div className="absolute -top-2 -left-2 w-10 h-10 bg-[#E42229] text-white rounded-full flex items-center justify-center font-bold">
                  {item.id}
                </div>
                <img src={item.img} alt={item.title} className="w-20 h-20 object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer minimal (opcional si ya tienes uno global) */}
      <footer className="bg-gray-100 py-10 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Marimon Perú. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Inicio;
