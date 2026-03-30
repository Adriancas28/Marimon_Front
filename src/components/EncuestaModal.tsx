import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface EncuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EncuestaModal({ isOpen, onClose }: EncuestaModalProps) {
  const navigate = useNavigate();
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(1);
  const [showThankYou, setShowThankYou] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    agrado_sistema: '',
    facilidad_pago: '',
    nps_score: '',
    sugerencias: ''
  });

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setShowThankYou(false);
      setFormData({
        nombre: '',
        correo: '',
        agrado_sistema: '',
        facilidad_pago: '',
        nps_score: '',
        sugerencias: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic validation for current step
    if (currentStep === 1) {
      if (!formData.nombre || !formData.correo) {
        alert("Por favor, completa los campos obligatorios.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.agrado_sistema || !formData.facilidad_pago) {
        alert("Por favor, selecciona una opción en ambas preguntas.");
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nps_score) {
      alert("Por favor, indica qué tan probable es que nos recomiendes.");
      return;
    }
    
    // Call API here in the future
    setShowThankYou(true);
    
    // Automatic redirection after 3 seconds
    setTimeout(() => {
      onClose();
      navigate('/inicio');
    }, 3000);
  };

  const calculateProgress = () => {
    return `${(currentStep / totalSteps) * 100}%`;
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} id="surveyModal">
      <div className="modal-content">
        <div className="modal-header">
            <h2 className="modal-title">
                <i className="bi bi-star-fill text-yellow-400 me-2"></i>
                Encuesta de Satisfacción
            </h2>
            <button type="button" className="modal-close" onClick={onClose}>
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
        
        <div className="modal-body p-6">
            <div className="survey-container">
                {!showThankYou ? (
                  <>
                    {/* Barra de progreso */}
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: calculateProgress() }}></div>
                        <div className="progress-labels mt-2">
                            <span>Paso <span>{currentStep}</span> de <span>{totalSteps}</span></span>
                        </div>
                    </div>

                    <form className="survey-form" onSubmit={handleSubmit}>
                        {/* Paso 1: Información personal */}
                        <div className={`survey-step ${currentStep === 1 ? 'active' : 'hidden'}`}>
                            <div className="step-header">
                                <div className="step-icon">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                <h3>Información Personal</h3>
                                <p>Ayúdanos a conocerte mejor</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="bi bi-person-fill me-2"></i>
                                    Nombre: <span className="required">*</span>
                                </label>
                                <input type="text" className="form-input" name="nombre" placeholder="Ingresa tu nombre completo"
                                    required value={formData.nombre} onChange={handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <i className="bi bi-envelope-fill me-2"></i>
                                    Correo Electrónico: <span className="required">*</span>
                                </label>
                                <input type="email" className="form-input" name="correo" placeholder="tu-email@ejemplo.com"
                                    required value={formData.correo} onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* Paso 2: Experiencia con el sistema */}
                        <div className={`survey-step ${currentStep === 2 ? 'active' : 'hidden'}`}>
                            <div className="step-header">
                                <div className="step-icon">
                                    <i className="bi bi-credit-card-fill"></i>
                                </div>
                                <h3>Experiencia de Pago</h3>
                                <p>Cuéntanos sobre tu experiencia</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label block mb-3">
                                    ¿Cuál fue su nivel de satisfacción con el sistema de pago?
                                    <span className="required">*</span>
                                </label>
                                <div className="satisfaction-rating grid gap-4 grid-cols-1 md:grid-cols-2">
                                    {[
                                      { value: 'excelente', emoji: '🤩', text: 'Excelente', sub: 'Superó mis expectativas' },
                                      { value: 'bueno', emoji: '😊', text: 'Bueno', sub: 'Muy satisfactorio' },
                                      { value: 'normal', emoji: '😐', text: 'Regular', sub: 'Cumplió lo básico' },
                                      { value: 'malo', emoji: '😞', text: 'Malo', sub: 'Necesita mejorar' }
                                    ].map(opt => (
                                      <label key={opt.value} className={`rating-option ${formData.agrado_sistema === opt.value ? 'selected border-[#E42229] bg-red-50' : 'border-gray-200'}`}>
                                          <input type="radio" name="agrado_sistema" value={opt.value} onChange={handleInputChange} checked={formData.agrado_sistema === opt.value} className="sr-only" />
                                          <div className="rating-content flex items-center w-full">
                                              <span className="rating-emoji mr-3">{opt.emoji}</span>
                                              <div className="flex flex-col flex-1 text-left">
                                                <span className="rating-text font-bold">{opt.text}</span>
                                                <small className="text-gray-500 text-xs">{opt.sub}</small>
                                              </div>
                                          </div>
                                      </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group mt-6">
                                <label className="form-label block mb-3">
                                    ¿Qué tan fácil fue completar su pago?
                                    <span className="required">*</span>
                                </label>
                                <div className="satisfaction-rating grid gap-4 grid-cols-1 md:grid-cols-2">
                                  {[
                                      { value: 'muy_facil', emoji: '🚀', text: 'Muy fácil', sub: 'Rápido y sencillo' },
                                      { value: 'facil', emoji: '👍', text: 'Fácil', sub: 'Sin complicaciones' },
                                      { value: 'normal', emoji: '👌', text: 'Regular', sub: 'Algunos pasos confusos' },
                                      { value: 'dificil', emoji: '😓', text: 'Difícil', sub: 'Muy complicado' }
                                    ].map(opt => (
                                      <label key={opt.value} className={`rating-option ${formData.facilidad_pago === opt.value ? 'selected border-[#E42229] bg-red-50' : 'border-gray-200'}`}>
                                          <input type="radio" name="facilidad_pago" value={opt.value} onChange={handleInputChange} checked={formData.facilidad_pago === opt.value} className="sr-only" />
                                          <div className="rating-content flex items-center w-full">
                                              <span className="rating-emoji mr-3">{opt.emoji}</span>
                                              <div className="flex flex-col flex-1 text-left">
                                                <span className="rating-text font-bold">{opt.text}</span>
                                                <small className="text-gray-500 text-xs">{opt.sub}</small>
                                              </div>
                                          </div>
                                      </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Paso 3: Recomendación y comentarios */}
                        <div className={`survey-step ${currentStep === 3 ? 'active' : 'hidden'}`}>
                            <div className="step-header">
                                <div className="step-icon">
                                    <i className="bi bi-hand-thumbs-up-fill"></i>
                                </div>
                                <h3>Recomendación</h3>
                                <p>Tu opinión nos ayuda a crecer</p>
                            </div>

                            <div className="form-group">
                                <label className="form-label mb-3 block">
                                    ¿Qué tan probable es que recomiende nuestro servicio?
                                    <span className="required">*</span>
                                </label>
                                <div className="nps-scale">
                                    <div className="nps-labels flex justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-500"><i className="bi bi-emoji-frown-fill me-1"></i> Poco probable</span>
                                        <span className="text-sm font-bold text-gray-500"><i className="bi bi-emoji-smile-fill me-1"></i> Muy probable</span>
                                    </div>
                                    <div className="nps-options flex gap-1 justify-between mt-4">
                                        {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                                            <label key={i} className={`nps-option flex flex-col items-center cursor-pointer ${formData.nps_score === String(i) ? 'selected' : ''}`} title={`${i} puntos`}>
                                                <input type="radio" name="nps_score" className="sr-only" value={i} onChange={handleInputChange} checked={formData.nps_score === String(i)} />
                                                <span className={`flex items-center justify-center w-10 h-10 border-2 rounded-full font-bold transition-all ${formData.nps_score === String(i) ? 'border-[#E42229] bg-[#E42229] text-white transform scale-110 shadow-lg' : 'border-gray-300 bg-white text-gray-700 hover:border-[#E42229] hover:bg-red-50 hover:scale-105'}`}>
                                                  {i}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mt-6">
                                <label className="form-label mb-2 block">
                                    <i className="bi bi-chat-dots-fill me-2"></i>
                                    ¿Tienes alguna sugerencia para mejorar?
                                </label>
                                <textarea className="comment-area w-full border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#E42229]" name="sugerencias" rows={4}
                                    placeholder="Tus comentarios son muy valiosos para nosotros. Compártenos qué te gustó más o qué podríamos mejorar. Opcional - Pero muy apreciado 😊"
                                    value={formData.sugerencias} onChange={handleInputChange}></textarea>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="form-navigation flex justify-between mt-8 border-t pt-4">
                            <button type="button" className={`btn-nav btn-prev flex items-center gap-2 px-6 py-2 border-2 rounded-xl font-bold transition-all ${currentStep === 1 ? 'invisible' : 'hover:bg-gray-100'}`} onClick={handlePrev}>
                                <i className="bi bi-chevron-left"></i> Anterior
                            </button>
                            
                            {currentStep < 3 ? (
                                <button type="button" className="btn-nav btn-next flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white rounded-xl font-bold hover:shadow-lg hover:translate-x-1 transition-all" onClick={handleNext}>
                                    Siguiente <i className="bi bi-chevron-right"></i>
                                </button>
                            ) : (
                                <button type="submit" className="btn-nav btn-submit flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all">
                                    <i className="bi bi-send-fill text-sm"></i> Enviar Encuesta
                                </button>
                            )}
                        </div>
                    </form>
                  </>
                ) : (
                  /* Mensaje de agradecimiento */
                  <div className="survey-thank-you show text-center py-10 fade-in">
                      <div className="thank-you-animation flex justify-center mb-6">
                          <i className="bi bi-check-circle-fill text-6xl text-green-500"></i>
                      </div>
                      <h3 className="text-3xl font-black mb-4">¡Muchas gracias por tu tiempo!</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">Tu opinión es muy valiosa y nos ayuda a mejorar nuestros servicios continuamente.</p>
                      
                      <button type="button" className="btn-nav btn-submit mx-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white rounded-xl font-bold hover:shadow-lg w-fit" onClick={onClose}>
                          <i className="bi bi-check2"></i> Entendido
                      </button>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
