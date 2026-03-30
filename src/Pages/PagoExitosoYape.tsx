import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import MainNavbar from '../components/MainNavbar';
import EncuestaModal from '../components/EncuestaModal';
import '../Styles/PagoExitosoYape.css';

export default function PagoExitosoYape() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const location = useLocation();
  // Simulamos un número de comprobante aleatorio o devuelto por el state
  const comprobante = location.state?.comprobante || `ORD-${Math.floor(Math.random() * 10000) + 1000}`;

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
                      <p>Hemos recibido tu comprobante de pago.</p>
                      <p>En breve, nuestro equipo validará la transacción y te notificaremos por correo electrónico.</p>
                      <p className="font-bold text-gray-800">Gracias por confiar en Marimon Autopartes.</p>
                  </div>

                  <div className="receipt-info text-left">
                      <div className="receipt-row">
                          <span className="receipt-label">Número de Comprobante:</span>
                          <span className="receipt-value boleta shadow-sm">
                              {comprobante}
                          </span>
                      </div>
                      <div className="receipt-divider"></div>
                      <div className="receipt-message">
                          <i className="bi bi-envelope-paper-fill"></i>
                          <p>Te avisaremos por correo cuando tu pago sea validado y tu compra esté lista.</p>
                      </div>
                  </div>

                  <div className="action-buttons mt-8">
                      <Link to="/catalogo" className="btn btn-store btn-hover justify-center">
                          <i className="bi bi-shop"></i>
                          <span>Volver a la Tienda</span>
                      </Link>
                      <button type="button" className="btn btn-survey btn-hover justify-center" onClick={() => setIsSurveyOpen(true)}>
                          <i className="bi bi-star-fill"></i>
                          <span>Encuesta de Satisfacción</span>
                      </button>
                      <Link to="/perfil" className="btn btn-outline-secondary btn-hover justify-center">
                          <i className="bi bi-card-list mr-1"></i>
                          <span>Mis Pedidos</span>
                      </Link>
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
