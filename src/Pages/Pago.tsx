import { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getUserName, isAuthenticated, getSessionValue } from "../utils/userSession";

export default function Pago() {
  const navigate = useNavigate();
  const [tipoComprobante, setTipoComprobante] = useState("boleta");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const { cartItems, cartTotal } = useCart();
  const isAuth = isAuthenticated();
  const userName = isAuth ? getUserName() : "";
  
  const [nombreBoleta, setNombreBoleta] = useState(() => getSessionValue("nombre") || "");
  const [apellidoBoleta, setApellidoBoleta] = useState(() => getSessionValue("apellido") || "");
  const [correoUsuario] = useState(() => getSessionValue("correo") || "");

  useEffect(() => {
    if (cartTotal > 500 && metodoPago === "yape") {
      alert("Para montos mayores a S/ 500, solo se permite el pago con tarjeta de crédito/débito.");
      setMetodoPago("tarjeta");
    }
  }, [metodoPago, cartTotal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuth) {
      alert("Debes iniciar sesión primero para poder realizar el pago.");
      navigate("/");
      return;
    }

    const newErrores: Record<string, string> = {};
    const formData = new FormData(e.target as HTMLFormElement);

    if (tipoComprobante === "boleta") {
      if (!nombreBoleta.trim()) newErrores.bol_nombre = "Ingrese su nombre.";
      if (!apellidoBoleta.trim()) newErrores.bol_apellido = "Ingrese sus apellidos.";
      
      if (!tipoDocumento) newErrores.tipoDocumento = "Seleccione un tipo de documento.";

      if (tipoDocumento === "DNI" && !/^\d{8}$/.test(numeroDocumento)) {
        newErrores.numeroDocumento = "El DNI debe ser de 8 dígitos.";
      } else if (tipoDocumento === "CE" && !/^\d{9}$/.test(numeroDocumento)) {
        newErrores.numeroDocumento = "El Carnet de Extranjería debe ser de 9 dígitos.";
      } else if (tipoDocumento === "Pasaporte" && !/^[A-Z0-9]{6,12}$/.test(numeroDocumento)) {
        newErrores.numeroDocumento = "El Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.";
      }
    } else if (tipoComprobante === "factura") {
      const ruc = formData.get("fac_ruc") as string;
      const razonSocial = formData.get("fac_razon") as string;
      const direccion = formData.get("fac_direccion") as string;

      if (!/^\d{11}$/.test(ruc)) newErrores.fac_ruc = "El RUC debe contener 11 dígitos.";
      if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s.,\-]{3,100}$/.test(razonSocial)) newErrores.fac_razon = "Razón social inválida.";
      if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s.,\-#]{5,150}$/.test(direccion)) newErrores.fac_direccion = "Dirección inválida.";
    }

    if (!aceptaTerminos) {
      newErrores.terminos = "Debe aceptar los términos y condiciones.";
    }

    setErrores(newErrores);

    if (Object.keys(newErrores).length === 0) {
      if (metodoPago === "yape") {
        navigate("/pago-yape", { state: { total: cartTotal.toFixed(2) } });
      } else {
        navigate("/pago-stripe", { state: { total: cartTotal } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 pb-12">
      <MainNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <form onSubmit={handleSubmit} noValidate>
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Link to="/catalogo" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b5f3a] shadow-sm transition hover:bg-[#0b5f3a] hover:text-white">
                <i className="bi bi-arrow-left text-xl"></i>
              </Link>
              <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Finaliza tu Compra</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 border border-green-200">
              <i className="bi bi-shield-check text-lg"></i>
              Compra 100% Segura
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Formulario Principal */}
            <div className="flex-1 order-2 lg:order-1 flex flex-col gap-6">

              {/* Tipo de Comprobante */}
              <div className="rounded-2xl border border-[#e4e4df] bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-bold text-slate-800 text-center">Selecciona el Tipo de Comprobante</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${tipoComprobante === "boleta" ? "border-[#0b5f3a] bg-green-50/30" : "border-transparent bg-gray-50 hover:bg-gray-100"}`}>
                    <input type="radio" value="boleta" checked={tipoComprobante === "boleta"} onChange={(e) => setTipoComprobante(e.target.value)} className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tipoComprobante === "boleta" ? "bg-[#0b5f3a] text-white" : "bg-white text-gray-500 shadow-sm"}`}>
                        <i className="bi bi-receipt text-lg"></i>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800">Boleta</span>
                        <span className="text-xs text-gray-500">Para personas naturales</span>
                      </div>
                    </div>
                  </label>

                  <label className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${tipoComprobante === "factura" ? "border-[#0b5f3a] bg-green-50/30" : "border-transparent bg-gray-50 hover:bg-gray-100"}`}>
                    <input type="radio" value="factura" checked={tipoComprobante === "factura"} onChange={(e) => setTipoComprobante(e.target.value)} className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tipoComprobante === "factura" ? "bg-[#0b5f3a] text-white" : "bg-white text-gray-500 shadow-sm"}`}>
                        <i className="bi bi-file-earmark-text text-lg"></i>
                      </div>
                      <div>
                        <span className="block font-bold text-slate-800">Factura</span>
                        <span className="text-xs text-gray-500">Para empresas o negocios</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Datos Boleta */}
              {tipoComprobante === "boleta" && (
                <div className="rounded-2xl border border-[#e4e4df] bg-white p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h4 className="mb-5 text-lg font-bold text-slate-800">Datos Personales</h4>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                      <input 
                        type="text" 
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.bol_nombre ? 'border-red-500 bg-white' : 'border-gray-300 bg-gray-50'}`}
                        value={nombreBoleta}
                        onChange={(e) => setNombreBoleta(e.target.value)}
                        placeholder="Ingresa tu nombre"
                      />
                      {errores.bol_nombre && <p className="mt-1 text-xs text-red-500">{errores.bol_nombre}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Apellidos *</label>
                      <input 
                        type="text" 
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.bol_apellido ? 'border-red-500 bg-white' : 'border-gray-300 bg-gray-50'}`}
                        value={apellidoBoleta}
                        onChange={(e) => setApellidoBoleta(e.target.value)}
                        placeholder="Ingresa tus apellidos"
                      />
                      {errores.bol_apellido && <p className="mt-1 text-xs text-red-500">{errores.bol_apellido}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Tipo de Documento *</label>
                      <select
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.tipoDocumento ? 'border-red-500' : 'border-gray-300'}`}
                        value={tipoDocumento}
                        onChange={(e) => {
                          setTipoDocumento(e.target.value);
                          setNumeroDocumento("");
                        }}
                      >
                        <option value="" disabled>Seleccione</option>
                        <option value="DNI">DNI</option>
                        <option value="CE">Carnet de Extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                      {errores.tipoDocumento && <p className="mt-1 text-xs text-red-500">{errores.tipoDocumento}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">N° de Documento *</label>
                      <input
                        type="text"
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.numeroDocumento ? 'border-red-500' : 'border-gray-300'}`}
                        value={numeroDocumento}
                        onChange={(e) => setNumeroDocumento(e.target.value)}
                      />
                      {errores.numeroDocumento && <p className="mt-1 text-xs text-red-500">{errores.numeroDocumento}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Datos Factura */}
              {tipoComprobante === "factura" && (
                <div className="rounded-2xl border border-[#e4e4df] bg-white p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h4 className="mb-5 text-lg font-bold text-slate-800">Datos de Facturación</h4>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                      <input type="text" className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed" value={getSessionValue("nombre") || userName || "No registrado"} readOnly />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Apellidos *</label>
                      <input type="text" className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed" value={getSessionValue("apellido") || "No registrado"} readOnly />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Correo Electrónico *</label>
                      <input type="email" className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed" value={correoUsuario || "correo@no-registrado.com"} readOnly />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Razón Social *</label>
                      <input name="fac_razon" type="text" placeholder="Ingrese razón social" className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.fac_razon ? 'border-red-500' : 'border-gray-300'}`} />
                      {errores.fac_razon && <p className="mt-1 text-xs text-red-500">{errores.fac_razon}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">N° de R.U.C. *</label>
                      <input name="fac_ruc" type="text" placeholder="Ingrese número de RUC" className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.fac_ruc ? 'border-red-500' : 'border-gray-300'}`} />
                      {errores.fac_ruc && <p className="mt-1 text-xs text-red-500">{errores.fac_ruc}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Dirección Fiscal o Comercial *</label>
                      <input name="fac_direccion" type="text" placeholder="Ingrese dirección fiscal completa" className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0b5f3a] focus:ring-1 focus:ring-[#0b5f3a] ${errores.fac_direccion ? 'border-red-500' : 'border-gray-300'}`} />
                      {errores.fac_direccion && <p className="mt-1 text-xs text-red-500">{errores.fac_direccion}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Entrega */}
              <div className="rounded-2xl border border-[#e4e4df] bg-white p-6 shadow-sm flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <i className="bi bi-shop text-2xl"></i>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Entrega en Tienda</h5>
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                    <i className="bi bi-geo-alt-fill"></i> Jr. Gral. Felipe Santiago Salaverry 44, Lima 15022
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <i className="bi bi-check-circle-fill"></i> Disponible para recojo
                  </div>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="rounded-2xl border border-[#e4e4df] bg-white p-6 shadow-sm">
                <h4 className="mb-5 text-lg font-bold text-slate-800 text-center">Selecciona el Método de Pago</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className={`relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all text-center ${metodoPago === "tarjeta" ? "border-[#0b5f3a] bg-green-50/30" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
                    <input type="radio" value="tarjeta" checked={metodoPago === "tarjeta"} onChange={(e) => setMetodoPago(e.target.value)} className="sr-only" />
                    <div className="flex gap-2 text-[#0b5f3a] mb-2">
                      <i className="bi bi-credit-card-2-front text-3xl"></i>
                      <i className="bi bi-credit-card text-3xl"></i>
                    </div>
                    <span className="font-bold text-slate-800 text-sm">Tarjeta de Crédito/Débito</span>
                  </label>

                  <label className={`custom-radio-btn relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all text-center ${metodoPago === "yape" ? "border-[#0b5f3a] bg-green-50/30" : "border-gray-200 bg-white hover:bg-gray-50"} ${cartTotal > 500 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" value="yape" checked={metodoPago === "yape"} onChange={(e) => setMetodoPago(e.target.value)} disabled={cartTotal > 500} className="sr-only" />
                    <div className="flex gap-2 text-purple-600 mb-2">
                      <i className="bi bi-bank text-3xl"></i>
                      <i className="bi bi-phone-fill text-3xl"></i>
                    </div>
                    <span className="font-bold text-slate-800 text-sm">Yape + Depósito</span>
                    {cartTotal > 500 && (
                      <span className="mt-1 text-xs text-red-500 font-medium">No disponible para &gt; S/ 500</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Alerta */}
              <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 flex gap-3 text-orange-800">
                <i className="bi bi-exclamation-triangle-fill text-2xl text-orange-500 shrink-0"></i>
                <div className="text-sm">
                  <strong>Importante:</strong> En este momento no contamos con servicio de envío a domicilio. Todas las compras deben ser recogidas en tienda física.
                </div>
              </div>

              {/* Términos y submit */}
              <div className="mt-4">
                <div className={`mt-2 bg-slate-50 rounded-xl p-4 border-l-4 transition-all duration-300 hover:shadow-md ${errores.terminos ? 'border-red-500 animate-[shake_0.5s_ease]' : 'border-slate-400 hover:border-[#0b5f3a]'}`}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`relative shrink-0 flex items-center justify-center min-w-[22px] min-h-[22px] w-[22px] h-[22px] border-2 rounded-md transition-all duration-200 cursor-pointer mt-0.5 ${aceptaTerminos ? 'bg-[#0b5f3a] border-[#0b5f3a] text-white' : 'bg-white border-slate-400 hover:border-[#0b5f3a]'}`}
                      onClick={() => {
                        setAceptaTerminos(!aceptaTerminos);
                        if (errores.terminos) {
                          setErrores((prev) => {
                            const newErr = { ...prev };
                            delete newErr.terminos;
                            return newErr;
                          });
                        }
                      }}
                    >
                      {aceptaTerminos && <i className="bi bi-check text-sm leading-none font-bold"></i>}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                    />
                    <div className="text-[0.95rem] leading-relaxed text-slate-600 relative top-[1px]">
                      He leído y acepto los <a href="#" className="font-semibold text-slate-800 hover:text-[#0b5f3a] transition-colors relative inline-flex items-center group decoration-transparent">
                        Términos y Condiciones
                        <i className="bi bi-box-arrow-up-right text-[0.8rem] ml-1 text-[#0b5f3a] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"></i>
                        <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#0b5f3a] scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom-right ease-out duration-300"></span>
                      </a>
                    </div>
                  </div>
                  {errores.terminos && <div className="text-red-500 text-xs mt-3 ml-9 font-medium">{errores.terminos}</div>}
                </div>

                <button type="submit" className="mt-8 w-full rounded-xl bg-[#0b5f3a] px-6 py-4 text-center font-bold text-white transition hover:bg-[#084b2e] flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98]">
                  {metodoPago === "tarjeta" ? (
                    <><i className="bi bi-credit-card-fill text-lg"></i> Pagar con Tarjeta</>
                  ) : (
                    <><i className="bi bi-phone-fill text-lg"></i> Pagar con Yape o Transferencia</>
                  )}
                </button>
              </div>

            </div>

            {/* Resumen de Pedido */}
            <div className="lg:w-[400px] shrink-0 order-1 lg:order-2">
              <div className="rounded-2xl border border-[#e4e4df] bg-white sticky top-24 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-bold text-slate-800">Resumen de Pedido</h3>
                </div>

                <div className="max-h-[380px] overflow-y-auto px-6 py-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition px-2 -mx-2 rounded-lg">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <i className="bi bi-image text-gray-400"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{item.nombre}</h4>
                          <span className="mt-1 block text-xs text-gray-500">Cantidad: {item.quantity}</span>
                        </div>
                        <span className="text-sm font-bold text-[#0b5f3a] mt-1">S/ {(item.precio * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                  <div className="flex items-center justify-between text-lg font-bold text-slate-800">
                    <span>TOTAL:</span>
                    <span className="text-[#0b5f3a] text-xl">S/ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>

    </div>
  );
}
