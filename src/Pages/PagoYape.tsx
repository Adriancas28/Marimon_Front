import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavbar from '../components/MainNavbar';
import '../Styles/PagoYape.css';

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
        state: { comprobante: 'YAPE-' + Math.floor(Math.random() * 900000 + 100000) } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <MainNavbar />
      
      <div className="container py-5 mx-auto px-4 max-w-4xl">
        <div className="flex justify-center flex-row">
          <div className="w-full lg:w-10/12 xl:w-9/12">
            <div className="card-container relative bg-white">
              <div className="p-4 lg:p-10">
                
                {/* Payment progress overlay */}
                {isSubmitting && (
                    <div className="payment-progress" style={{ display: 'flex' }}>
                        <div className="spinner"></div>
                        <div className="progress-text">Procesando su pago...</div>
                    </div>
                )}

                <div className="text-center mb-4 custom-fade-in fade-in-1">
                  <div className="logo-container mx-auto flex w-[150px] items-center justify-center rounded-2xl p-2">
                     <img src="https://logotipoperu.com/wp-content/uploads/2021/04/yape-logo-D09D1B9955-seeklogo.com.png" alt="Yape Logo" className="w-[100px] h-auto object-contain" />
                  </div>
                </div>

                <div className="flex flex-row justify-center mb-6 custom-fade-in fade-in-2">
                  <div className="w-full md:w-8/12 text-center flex flex-col items-center">
                    <div className="qr-box max-w-[250px] mx-auto w-full">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="Código QR Yape" className="w-full h-auto drop-shadow-sm opacity-80" />
                    </div>
                    <div className="total-container w-full max-w-[280px]">
                      <span className="total-label">TOTAL A PAGAR:</span>
                      <span className="total-amount">S/ {total}</span>
                    </div>
                    <h3 className="company-name mt-4 text-2xl font-black">Automotriz Marimon</h3>
                    <p className="phone-number mt-2 mb-2 text-xl shadow-md border border-gray-100">
                      <i className="bi bi-phone"></i> 961 582 804
                    </p>
                  </div>
                </div>

                <div className="custom-fade-in fade-in-3">
                    <div className="payment-methods mb-6 shadow-sm border border-gray-100">
                      <h5 className="text-lg"><i className="bi bi-list-check"></i> Instrucciones</h5>
                      <ol className="text-gray-700 font-medium">
                        <li>Escanea el código QR con tu aplicación Yape.</li>
                        <li>Realiza el pago del monto total indicado.</li>
                        <li>Toma una captura de pantalla del comprobante de pago.</li>
                        <li>Sube la imagen en el formulario a continuación.</li>
                      </ol>
                      
                      <div className="bcp-info shadow-sm mt-6 border border-gray-100">
                         <h6 className="text-md"><i className="bi bi-bank"></i> ¿Prefieres Transferencia Bancaria?</h6>
                         <p className="text-gray-700 font-medium my-2">
                            Cuenta BCP: <span className="account-number" onClick={handleCopyAccount}>{bcpAccount}</span>
                            {copied && <span className="text-[0.85rem] ml-2 text-[#32a852] font-black animate-in zoom-in">¡Copiado!</span>}
                         </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className={formShake ? 'animate-[shake_0.5s_ease]' : ''}>
                      <div className="mb-4 relative">
                        <label className="custom-file-upload">
                          <i className="bi bi-cloud-arrow-up"></i>
                          <div className="file-text text-gray-800">Sube tu Comprobante de Pago</div>
                          <div className="file-subtext text-gray-600 font-medium">JPG, JPEG, PNG (Máx: 5MB)</div>
                          
                          {fileError && (
                              <div className="bg-red-50 text-red-600 border border-red-200 mt-3 p-3 text-sm font-bold rounded-lg relative w-full text-left" role="alert">
                                  {fileError}
                              </div>
                          )}

                          <input 
                              type="file" 
                              className="form-control" 
                              accept="image/*" 
                              ref={fileInputRef}
                              onChange={handleFileChange} 
                          />
                        </label>

                        {previewUrl && (
                          <div className="image-preview-container flex justify-center mt-4 w-full md:w-1/2 mx-auto relative rounded-xl border border-gray-200 shadow-sm p-1">
                             <img src={previewUrl} alt="Vista previa" className="file-preview mt-0 h-auto" />
                             <button type="button" id="removeImage" onClick={handleRemoveImage} title="Eliminar imagen">
                               <i className="bi bi-x-lg"></i>
                             </button>
                          </div>
                        )}
                      </div>

                      <div className="alert-important mb-8 border border-yellow-200 shadow-sm">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div>
                          <strong>Importante:</strong>
                          <span className="text-gray-700 font-medium block mt-1">
                             Asegúrate que tu comprobante muestre claramente:
                          </span>
                          <ul className="text-gray-700 font-medium list-disc ml-5 mt-2">
                              <li>Número de operación</li>
                              <li>Fecha y hora del pago</li>
                              <li>Monto transferido</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row-reverse gap-4 mt-8 pt-4 border-t border-gray-100">
                         <button type="submit" className="btn-marimon flex-1 flex justify-center items-center shadow-lg">
                             <i className="bi bi-check-circle-fill me-2"></i>
                             <span className="text-lg">Confirmar Pago</span>
                         </button>
                         <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1 flex justify-center items-center">
                             <i className="bi bi-arrow-left me-2"></i> <span className="text-lg">Volver</span>
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
