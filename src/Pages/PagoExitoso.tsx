import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import MainNavbar from '../components/MainNavbar';
import EncuestaModal from '../components/EncuestaModal';
import '../Styles/PagoExitoso.css';

export default function PagoExitoso() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const location = useLocation();
  // Simulamos un número de comprobante tipo Factura/Boleta de sistema
  const comprobante = location.state?.comprobante || `CMP-${Math.floor(Math.random() * 900) + 100}`;

  useEffect(() => {
    // Fire confetti after a short delay
    setTimeout(() => {
        // Activamos los anillos
        const rings = document.querySelectorAll('.ring');
        rings.forEach(ring => ring.classList.add('animate'));

        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#E42229', '#D42025', '#626C66', '#ffda3a'],
            disableForReducedMotion: true
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors: ['#E42229', '#ffda3a'],
            });

            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors: ['#D42025', '#626C66'],
            });
        }, 700);
    }, 500);
  }, []);

  return (
    <>
      <MainNavbar />
      <div className="success-container">
          <div className="w-full max-w-4xl mx-auto px-4 flex justify-center">
              <div className="success-card w-full lg:w-10/12 xl:w-8/12 bg-white">
                  <div className="success-badge">
                      <img src="https://firebasestorage.googleapis.com/v0/b/marimonapp.appspot.com/o/Assest_web%2Fadasdscarro.png?alt=media&token=0634f7cd-cb65-4e33-99a0-be780f19ecda"
                          alt="Auto" style={{ height: '50px', width: 'auto' }} />
                  </div>

                  <div className="success-icon mx-auto flex justify-center w-full">
                      <i className="bi bi-check-circle-fill"></i>
                      <div className="success-rings">
                          <div className="ring ring1"></div>
                          <div className="ring ring2"></div>
                          <div className="ring ring3"></div>
                      </div>
                  </div>

                  <h1 className="success-title">¡Pago Completado con Éxito!</h1>

                  <div className="success-message">
                      <p className="font-medium text-lg text-gray-700">Tu compra ha sido procesada correctamente.</p>
                  </div>

                  <div className="receipt-info text-left">
                      <div className="receipt-row">
                          <span className="receipt-label">Número de Comprobante:</span>
                          <span className="receipt-value shadow-sm">
                              {comprobante}
                          </span>
                      </div>
                      <div className="receipt-divider"></div>
                      <div className="receipt-message">
                          <i className="bi bi-envelope-paper-fill"></i>
                          <p>Te hemos enviado el comprobante a tu correo electrónico.</p>
                      </div>
                  </div>

                  <div className="action-buttons mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                      <Link to="/catalogo" className="btn btn-store btn-hover justify-center">
                          <i className="bi bi-shop"></i>
                          <span>Volver a la Tienda</span>
                      </Link>
                      <button type="button" className="btn btn-survey btn-hover justify-center" onClick={() => setIsSurveyOpen(true)}>
                          <i className="bi bi-star-fill"></i>
                          <span>Encuesta de Satisfacción</span>
                      </button>
                      
                      {/* En lugar de download de PDF usar un dummy href para React */}
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Descargando comprobante..."); }} className="btn btn-download btn-hover justify-center bg-gray-100 border-2 border-gray-300 text-gray-700">
                          <i className="bi bi-download"></i>
                          <span>Descargar Comprobante</span>
                      </a>
                  </div>

                  <div className="success-footer mt-8">
                      <div className="badge-row">
                          <span className="custom-badge badge-hover">
                              <i className="bi bi-shield-fill-check"></i> Compra Segura
                          </span>
                          <span className="custom-badge badge-hover">
                              <i className="bi bi-award-fill"></i> Calidad Garantizada
                          </span>
                          <span className="custom-badge badge-hover">
                              <i className="bi bi-hand-thumbs-up-fill"></i> Servicio Confiable
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
