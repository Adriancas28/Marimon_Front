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
    <div className={`fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-[1000] p-5 box-border flex justify-center items-center animate-[fadeIn_0.3s_ease] ${isOpen ? '' : 'hidden'}`} id="surveyModal">
      <div className="bg-white rounded-3xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[modalSlideIn_0.4s_ease_forwards]">
        <div className="p-8 pb-4 border-b border-gray-100 sticky top-0 bg-black text-white rounded-t-3xl z-10 flex justify-center items-center">
            <h2 className="text-[1.8rem] font-bold m-0 flex items-center justify-center">
                <i className="bi bi-star-fill text-yellow-400 me-2"></i>
                Encuesta de Satisfacción
            </h2>
            <button type="button" className="absolute top-4 right-6 bg-white/20 border-none text-[1.2rem] cursor-pointer text-white w-[45px] h-[45px] flex items-center justify-center rounded-full transition-all duration-300 z-10 outline-none p-0 m-0 box-border hover:bg-white/30 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:rotate-90 hover:scale-110 active:rotate-90 active:scale-95 focus:outline-white/50 focus:outline-[2px]" onClick={onClose}>
                <i className="bi bi-x-lg pointer-events-none leading-none"></i>
            </button>
        </div>
        
        <div className="p-0">
            <div className="p-8">
                {!showThankYou ? (
                  <>
                    {/* Barra de progreso */}
                    <div className="mb-8 bg-gray-50 rounded-2xl h-2 overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-[#D42025] to-[#E42229] transition-all duration-500 ease-out rounded-2xl relative" style={{ width: calculateProgress() }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                        </div>
                        <div className="text-center text-[0.9rem] text-[#626C66] mt-2 font-semibold">
                            <span>Paso <span>{currentStep}</span> de <span>{totalSteps}</span></span>
                        </div>
                    </div>

                    <form className="survey-form" onSubmit={handleSubmit}>
                        {/* Paso 1: Información personal */}
                        <div className={`transition-all duration-400 ease-in-out ${currentStep === 1 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-[30px]'}`}>
                            <div className="text-center mb-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-[15px] border border-[#626C66]/20">
                                <div className="w-[60px] h-[60px] bg-gradient-to-br from-black to-[#626C66] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-[1.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                <h3 className="text-[1.5rem] font-bold text-black m-0 mb-2">Información Personal</h3>
                                <p className="text-[#626C66] m-0 text-base">Ayúdanos a conocerte mejor</p>
                            </div>

                            <div className="mb-8">
                                <label className="font-semibold text-black mb-4 flex items-center text-[1.1rem]">
                                    <i className="bi bi-person-fill me-2"></i>
                                    Nombre: <span className="text-[#E42229] font-bold ml-1">*</span>
                                </label>
                                <input type="text" className="w-full p-4 border-2 border-[#626C66]/40 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-[#E42229] focus:shadow-[0_0_0_4px_rgba(228,34,41,0.1)] focus:-translate-y-0.5" name="nombre" placeholder="Ingresa tu nombre completo"
                                    required value={formData.nombre} onChange={handleInputChange} />
                            </div>

                            <div className="mb-0">
                                <label className="font-semibold text-black mb-4 flex items-center text-[1.1rem]">
                                    <i className="bi bi-envelope-fill me-2"></i>
                                    Correo Electrónico: <span className="text-[#E42229] font-bold ml-1">*</span>
                                </label>
                                <input type="email" className="w-full p-4 border-2 border-[#626C66]/40 rounded-xl text-base transition-all duration-300 bg-white focus:outline-none focus:border-[#E42229] focus:shadow-[0_0_0_4px_rgba(228,34,41,0.1)] focus:-translate-y-0.5" name="correo" placeholder="tu-email@ejemplo.com"
                                    required value={formData.correo} onChange={handleInputChange} />
                            </div>
                        </div>

                        {/* Paso 2: Experiencia con el sistema */}
                        <div className={`transition-all duration-400 ease-in-out ${currentStep === 2 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-[30px]'}`}>
                            <div className="text-center mb-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-[15px] border border-[#626C66]/20">
                                <div className="w-[60px] h-[60px] bg-gradient-to-br from-black to-[#626C66] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-[1.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                    <i className="bi bi-credit-card-fill"></i>
                                </div>
                                <h3 className="text-[1.5rem] font-bold text-black m-0 mb-2">Experiencia de Pago</h3>
                                <p className="text-[#626C66] m-0 text-base">Cuéntanos sobre tu experiencia</p>
                            </div>

                            <div className="mb-8">
                                <label className="font-semibold text-black mb-4 block text-[1.1rem]">
                                    ¿Cuál fue su nivel de satisfacción con el sistema de pago?
                                    <span className="text-[#E42229] font-bold ml-1">*</span>
                                </label>
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
                                    {[
                                      { value: 'excelente', emoji: '🤩', text: 'Excelente', sub: 'Superó mis expectativas' },
                                      { value: 'bueno', emoji: '😊', text: 'Bueno', sub: 'Muy satisfactorio' },
                                      { value: 'normal', emoji: '😐', text: 'Regular', sub: 'Cumplió lo básico' },
                                      { value: 'malo', emoji: '😞', text: 'Malo', sub: 'Necesita mejorar' }
                                    ].map(opt => (
                                      <label key={opt.value} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#E42229] hover:bg-red-50 hover:-translate-y-1 ${formData.agrado_sistema === opt.value ? 'selected border-[#E42229] bg-red-50 text-[#E42229] shadow-[0_6px_15px_rgba(228,34,41,0.15)]' : 'border-gray-200'}`}>
                                          <input type="radio" name="agrado_sistema" value={opt.value} onChange={handleInputChange} checked={formData.agrado_sistema === opt.value} className="sr-only" />
                                          <div className="flex items-center w-full">
                                              <span className="text-[2rem] mr-4 grayscale-[0.8] hover:grayscale-0 transition-[filter] duration-300 group-hover:grayscale-0">{opt.emoji}</span>
                                              <div className="flex flex-col flex-1 text-left">
                                                <span className="font-bold text-[1.1rem]">{opt.text}</span>
                                                <small className={`text-xs ${formData.agrado_sistema === opt.value ? 'text-[#D42025]' : 'text-gray-500'}`}>{opt.sub}</small>
                                              </div>
                                          </div>
                                      </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-0 mt-6">
                                <label className="font-semibold text-black mb-4 block text-[1.1rem]">
                                    ¿Qué tan fácil fue completar su pago?
                                    <span className="text-[#E42229] font-bold ml-1">*</span>
                                </label>
                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
                                  {[
                                      { value: 'muy_facil', emoji: '🚀', text: 'Muy fácil', sub: 'Rápido y sencillo' },
                                      { value: 'facil', emoji: '👍', text: 'Fácil', sub: 'Sin complicaciones' },
                                      { value: 'normal', emoji: '👌', text: 'Regular', sub: 'Algunos pasos confusos' },
                                      { value: 'dificil', emoji: '😓', text: 'Difícil', sub: 'Muy complicado' }
                                    ].map(opt => (
                                      <label key={opt.value} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#E42229] hover:bg-red-50 hover:-translate-y-1 ${formData.facilidad_pago === opt.value ? 'selected border-[#E42229] bg-red-50 text-[#E42229] shadow-[0_6px_15px_rgba(228,34,41,0.15)]' : 'border-gray-200'}`}>
                                          <input type="radio" name="facilidad_pago" value={opt.value} onChange={handleInputChange} checked={formData.facilidad_pago === opt.value} className="sr-only" />
                                          <div className="flex items-center w-full">
                                              <span className="text-[2rem] mr-4 grayscale-[0.8] transition-[filter] duration-300 hover:grayscale-0">{opt.emoji}</span>
                                              <div className="flex flex-col flex-1 text-left">
                                                <span className="font-bold text-[1.1rem]">{opt.text}</span>
                                                <small className={`text-xs ${formData.facilidad_pago === opt.value ? 'text-[#D42025]' : 'text-gray-500'}`}>{opt.sub}</small>
                                              </div>
                                          </div>
                                      </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Paso 3: Recomendación y comentarios */}
                        <div className={`transition-all duration-400 ease-in-out ${currentStep === 3 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-[30px]'}`}>
                            <div className="text-center mb-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-[15px] border border-[#626C66]/20">
                                <div className="w-[60px] h-[60px] bg-gradient-to-br from-black to-[#626C66] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-[1.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                    <i className="bi bi-hand-thumbs-up-fill"></i>
                                </div>
                                <h3 className="text-[1.5rem] font-bold text-black m-0 mb-2">Recomendación</h3>
                                <p className="text-[#626C66] m-0 text-base">Tu opinión nos ayuda a crecer</p>
                            </div>

                            <div className="mb-8">
                                <label className="font-semibold text-black mb-4 block text-[1.1rem]">
                                    ¿Qué tan probable es que recomiende nuestro servicio?
                                    <span className="text-[#E42229] font-bold ml-1">*</span>
                                </label>
                                <div className="mt-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-500"><i className="bi bi-emoji-frown-fill me-1"></i> Poco probable</span>
                                        <span className="text-sm font-bold text-gray-500"><i className="bi bi-emoji-smile-fill me-1"></i> Muy probable</span>
                                    </div>
                                    <div className="flex gap-1 justify-between mt-4">
                                        {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                                            <label key={i} className="flex flex-col items-center cursor-pointer" title={`${i} puntos`}>
                                                <input type="radio" name="nps_score" className="sr-only" value={i} onChange={handleInputChange} checked={formData.nps_score === String(i)} />
                                                <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full font-bold transition-all duration-300 ${formData.nps_score === String(i) ? 'border-[#E42229] bg-[#E42229] text-white scale-110 shadow-[0_4px_10px_rgba(228,34,41,0.4)]' : 'border-gray-300 bg-white text-gray-700 hover:border-[#E42229] hover:bg-red-50 hover:scale-105 hover:text-[#E42229]'}`}>
                                                  {i}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-0 mt-6">
                                <label className="font-semibold text-black mb-2 block text-[1.1rem]">
                                    <i className="bi bi-chat-dots-fill me-2"></i>
                                    ¿Tienes alguna sugerencia para mejorar?
                                </label>
                                <textarea className="w-full border-2 border-gray-300 rounded-xl p-4 text-base resize-y min-h-[120px] transition-all bg-white focus:outline-none focus:border-[#E42229] focus:shadow-[0_0_0_4px_rgba(228,34,41,0.1)] focus:-translate-y-0.5" name="sugerencias" rows={4}
                                    placeholder="Tus comentarios son muy valiosos para nosotros. Compártenos qué te gustó más o qué podríamos mejorar. Opcional - Pero muy apreciado 😊"
                                    value={formData.sugerencias} onChange={handleInputChange}></textarea>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="flex justify-between mt-8 border-t pt-6 bg-white/90 pb-2">
                            <button type="button" className={`flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold bg-white cursor-pointer transition-all duration-300 ${currentStep === 1 ? 'invisible' : 'hover:bg-gray-100 hover:border-gray-300 hover:text-black hover:-translate-x-1'}`} onClick={handlePrev}>
                                <i className="bi bi-chevron-left"></i> Anterior
                            </button>
                            
                            {currentStep < 3 ? (
                                <button type="button" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white rounded-xl font-bold border-none cursor-pointer transition-all duration-300 shadow-[0_6px_15px_rgba(228,34,41,0.2)] hover:shadow-[0_8px_20px_rgba(228,34,41,0.3)] hover:scale-[1.02] hover:translate-x-1" onClick={handleNext}>
                                    Siguiente <i className="bi bi-chevron-right text-sm"></i>
                                </button>
                            ) : (
                                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white rounded-xl font-bold border-none cursor-pointer transition-all duration-300 shadow-[0_6px_15px_rgba(228,34,41,0.2)] hover:shadow-[0_8px_20px_rgba(228,34,41,0.3)] hover:scale-[1.02] hover:-translate-y-1">
                                    <i className="bi bi-send-fill text-sm"></i> Enviar Encuesta
                                </button>
                            )}
                        </div>
                    </form>
                  </>
                ) : (
                  /* Mensaje de agradecimiento */
                  <div className="text-center py-10 animate-[fadeIn_0.5s_ease_forwards]">
                      <div className="flex justify-center mb-6">
                          <i className="bi bi-check-circle-fill text-6xl text-green-500 animate-[zoomIn_0.5s_ease_forwards_0.2s] opacity-0 [animation-fill-mode:forwards]"></i>
                      </div>
                      <h3 className="text-3xl font-black mb-4">¡Muchas gracias por tu tiempo!</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">Tu opinión es muy valiosa y nos ayuda a mejorar nuestros servicios continuamente.</p>
                      
                      <button type="button" className="mx-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#E42229] to-[#D42025] text-white border-none cursor-pointer rounded-xl font-bold shadow-[0_6px_15px_rgba(228,34,41,0.2)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(228,34,41,0.3)] hover:-translate-y-1" onClick={onClose}>
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
