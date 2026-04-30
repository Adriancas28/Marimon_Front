import MainNavbar from "../components/MainNavbar";

function Nosotros() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Nunito',_sans-serif]">
      <MainNavbar />

      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        
        {/* Header Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
              AUTOMOTRIZ <br />
              <span className="text-[#D42025]">MARIMON S.A.C</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed text-justify">
              Somos una empresa comprometida con brindar servicios automotrices de calidad superior.
              Nuestra experiencia en el sector nos ha permitido entender las necesidades de nuestros clientes
              y ofrecer soluciones efectivas y confiables para el mantenimiento y reparación de sus vehículos.
              Contamos con personal altamente calificado y tecnología de punta para garantizar resultados
              excepcionales.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#D42025]/10 rounded-[30px] blur-2xl group-hover:bg-[#D42025]/20 transition-all duration-500"></div>
            <div className="relative rounded-[25px] overflow-hidden shadow-2xl border-8 border-white">
               <img 
                 src="/images/nosotros-car.PNG" 
                 alt="Taller Automotriz" 
                 className="w-full h-auto transition-transform duration-700 group-hover:scale-110" 
               />
            </div>
          </div>
        </section>

        {/* Mission, Vision, Objectives Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              title: "Misión",
              icon: "bi-globe",
              text: "Brindar un servicio integral de excelencia en el mantenimiento y reparación de vehículos, con el compromiso de superar la plena satisfacción de las necesidades de los propietarios."
            },
            {
              title: "Visión",
              icon: "bi-eye",
              text: "Convertirnos en el taller autorizado de referencia en Lima Moderna, creando valor para nuestros clientes, colaboradores y el entorno social."
            },
            {
              title: "Objetivos",
              icon: "bi-bullseye",
              text: "Alcanzar constantemente altos índices de disponibilidad operativa, atendiendo con prontitud las necesidades de reparación para la total satisfacción del cliente."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <i className={`bi ${item.icon} text-3xl text-[#D42025]`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed flex-grow">{item.text}</p>
              <div className="w-12 h-1 bg-[#D42025] mt-6 rounded-full"></div>
            </div>
          ))}
        </section>

        {/* Values Section */}
        <section className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-800 mb-16">Nuestros Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Servicio", img: "/images/servicios_nosotros.png", desc: "Compromiso con la satisfacción y atención al cliente." },
              { title: "Integridad", img: "/images/integridad.jpeg", desc: "Honestidad y transparencia en cada interacción." },
              { title: "Excelencia", img: "/images/excelencia.jpeg", desc: "Perseguimos la perfección en cada detalle de nuestro trabajo." },
              { title: "Innovación", img: "/images/innovacion.jpeg", desc: "Adoptamos nuevas tecnologías para mejorar constantemente." },
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-50">
                <div className="relative h-48 mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={value.img} 
                    alt={value.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                <div className="w-8 h-1 bg-[#D42025] mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-400 text-sm font-medium italic">
            "Comprometidos con la seguridad de tu vehículo desde hace 50 años"
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Nosotros;
