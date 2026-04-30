import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';

export default function PagoYape() {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formShake, setFormShake] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intentar obtener el total del estado de navegación, por defecto 0.00
  const total = location.state?.total || "0.00";
  const orderData = location.state?.orderData || null;
  const bcpAccount = "25575353391071";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validar tamaño (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('El archivo es demasiado grande. Por favor, sube una imagen de menos de 5MB.');
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bcpAccount).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setFileError('Debes adjuntar una imagen del comprobante de pago para continuar.');
      setFormShake(true);
      setTimeout(() => setFormShake(false), 1000);
      return;
    }

    // Mostrar overlay de carga
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/pago-exitoso-yape', { 
        state: { 
          comprobante: 'YAPE-' + Math.floor(Math.random() * 900000 + 100000),
          orderData: orderData ? { ...orderData, metodoPagoId: 1 } : null, // 1 = Yape
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#f8f8f8] text-black">
      <MainNavbar />
      
      <div className="container py-5 mx-auto px-4 max-w-4xl mt-6">
        <div className="flex justify-center flex-row">
          <div className="w-full lg:w-10/12 xl:w-9/12">
            <div className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-2 before:bg-white">
              <div className="p-4 sm:p-8 lg:p-10">
                
                {/* Payment progress overlay */}
                {isSubmitting && (
                    <div className="fixed inset-0 w-full h-full bg-black/70 z-[9999] flex flex-col justify-center items-center">
                        <div className="w-[80px] h-[80px] border-8 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <div className="text-white mt-5 font-semibold text-lg animate-pulse">Procesando su pago...</div>
                    </div>
                )}

                <div className="text-center mb-4 opacity-0 animate-[fadeInUp_0.6s_ease_0.2s_forwards]">
                  <div className="mx-auto flex w-[150px] items-center justify-center rounded-2xl p-2 animate-[pulse-scale_1s_ease_infinite]">
                     <img src="https://logotipoperu.com/wp-content/uploads/2021/04/yape-logo-D09D1B9955-seeklogo.com.png" alt="Yape Logo" className="w-[100px] h-auto object-contain" />
                  </div>
                </div>

                <div className="flex flex-row justify-center mb-6 opacity-0 animate-[fadeInUp_0.6s_ease_0.4s_forwards]">
                  <div className="w-full md:w-8/12 text-center flex flex-col items-center">
                    <div className="p-[15px] bg-white rounded-2xl border-2 border-dashed border-[#626C66] max-w-[250px] mx-auto w-full">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="Código QR Yape" className="w-full h-auto drop-shadow-sm opacity-80 rounded-xl" />
                    </div>
                    <div className="bg-[#E42229] rounded-2xl p-[15px] mt-[20px] text-white flex justify-between items-center w-full max-w-[280px]">
                      <span className="font-semibold text-[1.1rem]">TOTAL A PAGAR:</span>
                      <span className="font-semibold text-[1.1rem]">S/ {total}</span>
                    </div>
                    <h3 className="font-bold mt-4 text-2xl text-black">Automotriz Marimon</h3>
                    <p className="flex items-center justify-center gap-[5px] py-[8px] px-[15px] bg-white rounded-full mx-auto w-fit font-semibold mt-2 mb-2 text-xl shadow-md border border-gray-100">
                      <i className="bi bi-phone text-[#E42229]"></i> 961 582 804
                    </p>
                  </div>
                </div>

                <div className="opacity-0 animate-[fadeInUp_0.6s_ease_0.6s_forwards]">
                    <div className="bg-[#f8f8f8] rounded-2xl p-[20px] mb-[25px] shadow-sm border border-gray-100">
                      <h5 className="flex items-center gap-[10px] font-bold mb-[15px] text-lg text-black">
                        <i className="bi bi-list-check text-[#E42229] text-[1.2rem]"></i> Instrucciones
                      </h5>
                      <ol className="text-gray-700 font-medium pl-[20px] mb-[20px] list-decimal marker:text-[#E42229] marker:font-bold">
                        <li className="mb-[10px] pl-[5px]">Escanea el código QR con tu aplicación Yape.</li>
                        <li className="mb-[10px] pl-[5px]">Realiza el pago del monto total indicado.</li>
                        <li className="mb-[10px] pl-[5px]">Toma una captura de pantalla del comprobante de pago.</li>
                        <li className="mb-[10px] pl-[5px]">Sube la imagen en el formulario a continuación.</li>
                      </ol>
                      
                      <div className="bg-white rounded-2xl p-[15px] border-l-[4px] border-l-[#E42229] shadow-sm mt-6 border border-gray-100">
                         <h6 className="flex items-center gap-[10px] font-semibold mb-[10px] text-md text-black">
                           <i className="bi bi-bank text-[#E42229]"></i> ¿Prefieres Transferencia Bancaria?
                         </h6>
                         <p className="text-gray-700 font-medium my-2">
                            Cuenta BCP: <span className="font-bold tracking-[1px] py-[2px] px-[6px] bg-[#f0f0f0] rounded-[4px] cursor-pointer transition-colors duration-200 hover:bg-[#e0e0e0]" onClick={handleCopyAccount}>{bcpAccount}</span>
                            {copied && <span className="text-[0.85rem] ml-2 text-[#32a852] font-black animate-[fadeIn_0.3s_ease]">¡Copiado!</span>}
                         </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className={formShake ? 'animate-[shake_0.5s_ease]' : ''}>
                      <div className="mb-4 relative">
                        <label className="flex flex-col items-center justify-center p-[30px] border-2 border-dashed border-[#626C66] rounded-2xl bg-[#f8f8f8] cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-[#f0f0f0]">
                          <i className="bi bi-cloud-arrow-up text-[2.5rem] mb-[10px] text-[#E42229]"></i>
                          <div className="font-semibold text-[1.1rem] mb-[5px] text-gray-800">Sube tu Comprobante de Pago</div>
                          <div className="text-[0.85rem] opacity-70 text-gray-600 font-medium">JPG, JPEG, PNG (Máx: 5MB)</div>
                          
                          {fileError && (
                              <div className="bg-red-50 text-red-600 border border-red-200 mt-3 p-3 text-sm font-bold rounded-lg relative w-full text-left" role="alert">
                                  {fileError}
                              </div>
                          )}

                          <input 
                              type="file" 
                              className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer" 
                              accept="image/*" 
                              ref={fileInputRef}
                              onChange={handleFileChange} 
                          />
                        </label>

                        {previewUrl && (
                          <div className="flex justify-center mt-4 w-full md:w-1/2 mx-auto relative rounded-xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1">
                             <img src={previewUrl} alt="Vista previa" className="w-full h-auto rounded-xl" />
                             <button type="button" onClick={handleRemoveImage} title="Eliminar imagen" className="absolute top-[15px] right-[15px] bg-[#dc3545] text-white border-none rounded-full w-[32px] h-[32px] flex items-center justify-center cursor-pointer opacity-85 transition-all duration-300 shadow-[0_2px_5px_rgba(0,0,0,0.3)] z-[1000] p-0 hover:opacity-100 hover:scale-110">
                               <i className="bi bi-x-lg text-[16px]"></i>
                             </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-[15px] bg-[#ffc107]/10 p-[15px] rounded-2xl mt-[20px] mb-8 border border-yellow-200 shadow-sm">
                        <i className="bi bi-exclamation-triangle-fill text-[1.5rem] text-[#d42025] shrink-0"></i>
                        <div>
                          <strong className="text-black block mb-[5px]">Importante:</strong>
                          <span className="text-gray-700 font-medium block mt-1">
                             Asegúrate que tu comprobante muestre claramente:
                          </span>
                          <ul className="text-gray-700 font-medium list-disc pl-[20px] m-0 mt-2">
                              <li className="mb-[3px]">Número de operación</li>
                              <li className="mb-[3px]">Fecha y hora del pago</li>
                              <li className="mb-[3px]">Monto transferido</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row-reverse gap-4 mt-8 pt-6 border-t border-gray-100">
                         <button type="submit" className="flex-1 flex justify-center items-center shadow-lg bg-gradient-to-r from-[#E42229] to-[#D42025] border-none rounded-full p-[12px_20px] font-semibold transition-all duration-300 text-white group hover:shadow-[0_8px_20px_rgba(228,34,41,0.3)] hover:-translate-y-1">
                             <i className="bi bi-check-circle-fill me-2 text-white group-hover:translate-x-[3px] transition-transform"></i>
                             <span className="text-lg text-white">Confirmar Pago</span>
                         </button>
                         <button type="button" onClick={() => navigate(-1)} className="flex-1 flex justify-center items-center bg-transparent border-2 border-[#E42229] rounded-full p-[10px_20px] font-semibold transition-all duration-300 text-[#E42229] group hover:bg-[#E42229] hover:text-white hover:-translate-y-1">
                             <i className="bi bi-arrow-left me-2 md:mr-2 text-[#E42229] group-hover:text-white transition-colors"></i> <span className="text-lg text-[#E42229] group-hover:text-white transition-colors">Volver</span>
                         </button>
                      </div>
                    </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
