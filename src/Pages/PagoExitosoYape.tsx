import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import MainNavbar from '../components/MainNavbar';
import EncuestaModal from '../components/EncuestaModal';
import { useCart } from '../context/CartContext';

export default function PagoExitosoYape() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const location = useLocation();
  const { clearCart } = useCart();
  const comprobante = location.state?.comprobante || `ORD-${Math.floor(Math.random() * 10000) + 1000}`;
  const orderData = location.state?.orderData || null;

  useEffect(() => {
    console.log("[PagoExitosoYape] Iniciando registro de venta...");
    console.log("[PagoExitosoYape] orderData recibido:", orderData);

    // Registrar venta en el backend (solo una vez por sesión)
    if (orderData && !sessionStorage.getItem('venta_registrada_yape')) {
      console.log("[PagoExitosoYape] Enviando POST a /api/venta...");
      sessionStorage.setItem('venta_registrada_yape', '1');
      clearCart();
      const body = {
        usuarioId: orderData.usuarioId,
        metodoPagoId: orderData.metodoPagoId ?? 1,
        detalles: orderData.detalles ?? [],
        comprobante: {
          tipo: orderData.tipoComprobante ?? 'boleta',
          bolNombre: orderData.bolNombre ?? null,
          bolApellido: orderData.bolApellido ?? null,
          bolTipoDocumento: orderData.bolTipoDocumento ?? null,
          bolNumeroDocumento: orderData.bolNumeroDocumento ?? null,
          facRuc: orderData.facRuc ?? null,
          facRazonSocial: orderData.facRazonSocial ?? null,
          facDireccion: orderData.facDireccion ?? null,
          evidencia: null,
        },
      };
      fetch('/api/venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(err => console.warn('No se pudo registrar la venta:', err));
    }

    // Confetti
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#E42229', '#D42025', '#626C66', '#ffda3a'], disableForReducedMotion: true });
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#E42229', '#ffda3a'] });
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#D42025', '#626C66'] });
      }, 700);
    }, 500);
  }, []);

  return (
    <>
      <MainNavbar />
      <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 [perspective:1200px]">
          <div className="w-full max-w-4xl mx-auto px-4 flex justify-center">
              <div className="relative bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] pt-16 px-6 sm:px-10 pb-12 text-center max-w-[700px] w-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden z-10 animate-[fadeInUp_0.8s_ease_forwards]">
                  {/* Badge */}
                  <div className="absolute top-0 right-0 w-[110px] h-[80px] bg-gradient-to-br from-[#E42229] to-[#D42025] flex justify-end items-start pt-[10px] pr-[15px] [clip-path:polygon(50%_0%,100%_0,100%_100%,50%_100%,0_0)]">
                      <img src="https://firebasestorage.googleapis.com/v0/b/marimonapp.appspot.com/o/Assest_web%2Fadasdscarro.png?alt=media&token=0634f7cd-cb65-4e33-99a0-be780f19ecda"
                          alt="Auto" style={{ height: '50px', width: 'auto', position: 'relative', left: '10px', top: '-5px' }} />
                  </div>

                  <div className="relative inline-flex justify-center items-center mb-8 mx-auto w-full animate-[fadeInUp_0.5s_ease_forwards]">
                      <i className="bi bi-check-circle-fill text-[5.5rem] text-[#28a745] relative z-10 animate-pulse drop-shadow-[0_5px_15px_rgba(40,167,69,0.3)]"></i>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                          <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-[#48c267] opacity-0 w-[100px] h-[100px] animate-[ripple_2s_infinite]"></div>
                          <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-[#48c267] opacity-0 w-[130px] h-[130px] animate-[ripple_2s_infinite_0.3s]"></div>
                          <div className="absolute rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-[#48c267] opacity-0 w-[160px] h-[160px] animate-[ripple_2s_infinite_0.6s]"></div>
                      </div>
                  </div>

                  <h1 className="font-extrabold text-[2rem] sm:text-[2.5rem] text-[#424a45] mb-6 relative inline-block animate-[fadeInUp_0.8s_ease_forwards] [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards] after:content-[''] after:absolute after:-bottom-2.5 after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:h-1 after:bg-gradient-to-r after:from-[#E42229] after:to-[#D42025] after:rounded-full">¡Pago Completado con Éxito!</h1>

                  <div className="text-xl text-[#626C66] mb-8 animate-[fadeInUp_0.8s_ease_forwards] [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
                      <p className="text-[1.1rem] leading-relaxed mb-1 text-gray-700">Hemos recibido tu comprobante de pago.</p>
                      <p className="text-[1.1rem] leading-relaxed mb-1 text-gray-700">En breve, nuestro equipo validará la transacción y te notificaremos por correo electrónico.</p>
                      <p className="font-bold text-[1.1rem] leading-relaxed mt-2 text-gray-800">Gracias por confiar en Marimon Autopartes.</p>
                  </div>

                  <div className="bg-gradient-to-br from-white/90 to-[#f0f2f1]/90 rounded-xl p-6 my-8 shadow-sm relative border-l-[5px] border-l-[#E42229] text-left animate-[fadeInUp_0.8s_ease_forwards] [animation-delay:0.7s] opacity-0 [animation-fill-mode:forwards]">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                          <span className="font-semibold text-[#626C66]">Número de Comprobante:</span>
                          <span className="font-extrabold text-[1.2rem] text-[#E42229] py-1 px-3 bg-[#E42229]/10 rounded-lg tracking-wide shadow-sm">
                              {comprobante}
                          </span>
                      </div>
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#d1d5db] to-transparent my-5"></div>
                      <div className="flex items-center justify-center gap-4">
                          <i className="bi bi-envelope-paper-fill text-[1.8rem] text-[#626C66]"></i>
                          <p className="m-0 font-semibold text-sm sm:text-base">Te avisaremos por correo cuando tu pago sea validado y tu compra esté lista.</p>
                      </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 my-8 animate-[fadeInUp_0.8s_ease_forwards] [animation-delay:0.9s] opacity-0 [animation-fill-mode:forwards]">
                      <Link to="/catalogo" className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-base no-underline transition-all duration-300 border-none sm:min-w-[200px] relative overflow-hidden bg-gradient-to-br from-[#E42229] to-[#D42025] text-white shadow-[0_6px_12px_rgba(228,34,41,0.25)] hover:-translate-y-1 hover:shadow-[0_10px_15px_rgba(228,34,41,0.3)]">
                          <i className="bi bi-shop text-[1.1rem]"></i>
                          <span>Volver a la Tienda</span>
                      </Link>
                      <button type="button" className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-base transition-all duration-300 border-none sm:min-w-[200px] relative overflow-hidden bg-white text-[#E42229] border-2 border-[#E42229] shadow-[0_4px_8px_rgba(0,0,0,0.05)] hover:bg-[#E42229] hover:text-white hover:-translate-y-1 hover:shadow-[0_6px_10px_rgba(0,0,0,0.1)]" onClick={() => setIsSurveyOpen(true)}>
                          <i className="bi bi-star-fill text-[1.1rem]"></i>
                          <span>Encuesta de Satisfacción</span>
                      </button>
                      <Link to="/perfil" className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-bold text-base transition-all duration-300 border-none sm:min-w-[200px] relative overflow-hidden bg-[#f0f2f1] text-[#424a45] shadow-[0_4px_8px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:bg-[#626C66] hover:text-white hover:shadow-[0_6px_10px_rgba(0,0,0,0.1)]">
                          <i className="bi bi-card-list min-[0px]:mr-1 text-[1.1rem]"></i>
                          <span>Mis Pedidos</span>
                      </Link>
                  </div>

                  <div className="mt-10 pt-6 border-t border-dashed border-[#d1d5db] animate-[fadeInUp_0.8s_ease_forwards] [animation-delay:1.1s] opacity-0 [animation-fill-mode:forwards]">
                      <div className="flex flex-wrap justify-center gap-3">
                          <span className="inline-flex items-center gap-1.5 bg-[#f0f2f1] text-[#626C66] py-2 px-4 rounded-full text-[0.85rem] font-semibold transition-all duration-300 hover:bg-[#E42229]/10 hover:text-[#D42025] hover:-translate-y-0.5">
                              <i className="bi bi-shield-fill-check text-[#E42229] text-[0.9rem]"></i> Compra Segura
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#f0f2f1] text-[#626C66] py-2 px-4 rounded-full text-[0.85rem] font-semibold transition-all duration-300 hover:bg-[#E42229]/10 hover:text-[#D42025] hover:-translate-y-0.5">
                              <i className="bi bi-award-fill text-[#E42229] text-[0.9rem]"></i> Calidad Garantizada
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-[#f0f2f1] text-[#626C66] py-2 px-4 rounded-full text-[0.85rem] font-semibold transition-all duration-300 hover:bg-[#E42229]/10 hover:text-[#D42025] hover:-translate-y-0.5">
                              <i className="bi bi-hand-thumbs-up-fill text-[#E42229] text-[0.9rem]"></i> Servicio Confiable
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <EncuestaModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
    </>
  );
}
