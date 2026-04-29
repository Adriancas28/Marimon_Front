import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import MainNavbar from "../components/MainNavbar";

// Usamos una llave pública de prueba de Stripe
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function CheckoutForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [isCardComplete, setIsCardComplete] = useState(false);

  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!nameOnCard.trim()) {
      setError("Por favor, ingresa el nombre que aparece en la tarjeta.");
      return;
    }

    if (!isCardComplete) {
      setError("Por favor, ingresa un número de tarjeta válido y completo.");
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setProcessing(false);
      return;
    }

    // Creación del PaymentMethod con Stripe
    const { error: stripeError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: nameOnCard,
        },
      });

    if (stripeError) {
      // Errores provistos directamente por Stripe (fondos insuficientes, tarjeta expirada, etc.)
      setError(stripeError.message || "Ocurrió un error al procesar la tarjeta.");
      setProcessing(false);
      return;
    }

    // --- MOCK BACKEND VALIDATION ---
    // Como no tenemos un backend real con PaymentIntents, simulamos la validación 
    // estricta requiriendo la tarjeta de prueba estándar de Stripe (4242)
    if (paymentMethod.card?.last4 !== "4242") {
       setError("Pago declinado. Para este entorno de prueba, por favor usa la tarjeta de prueba de Stripe (4242 4242 4242 4242) con cualquier fecha y CVC válido.");
       setProcessing(false);
       return;
    }

    // Simular tiempo de validación de pago exitoso
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate("/pago-exitoso", {
          state: {
            comprobante: `STRIPE-${paymentMethod.id
              .substring(paymentMethod.id.length - 6)
              .toUpperCase()}`,
          },
        });
      }, 1500); // Wait a bit to show the success animation
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative">
      {/* Overlay de procesamiento/éxito */}
      {(processing || success) && (
        <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          {success ? (
            <div className="flex flex-col items-center text-[#0b5f3a] animate-in zoom-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 shadow-inner">
                <i className="bi bi-check-lg text-4xl"></i>
              </div>
              <p className="font-bold text-lg">¡Pago Exitoso!</p>
              <p className="text-sm text-gray-500 mt-1">Redirigiendo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-[#0b5f3a]">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0b5f3a] rounded-full animate-spin mb-3 shadow-sm"></div>
              <p className="font-semibold text-slate-700">Procesando pago...</p>
              <p className="text-xs text-gray-500 mt-1">
                Por favor, no cierres esta ventana
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Nombre en la tarjeta */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Nombre en la Tarjeta
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <i className="bi bi-person-badge text-lg"></i>
            </div>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => {
                setNameOnCard(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej. Juan Pérez"
              className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b5f3a]/20 focus:border-[#0b5f3a] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Datos de la tarjeta */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Información de la Tarjeta
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
              <i className="bi bi-credit-card text-lg"></i>
            </div>
            <div className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-[#0b5f3a]/20 focus-within:border-[#0b5f3a] transition-all shadow-sm overflow-hidden">
              <CardElement
                onChange={(e) => {
                  setIsCardComplete(e.complete);
                  // Capturar errores nativos de validación de Stripe (ej. número incompleto, fecha inválida)
                  if (e.error) {
                    setError(e.error.message);
                  } else {
                    setError(null);
                  }
                }}
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1e293b", // text-slate-800
                      fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
                      "::placeholder": {
                        color: "#94a3b8", // text-slate-400
                      },
                      iconColor: "#0b5f3a",
                    },
                    invalid: {
                      color: "#ef4444", // text-red-500
                      iconColor: "#ef4444",
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-3.5 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 border border-red-100">
          <i className="bi bi-exclamation-triangle-fill text-red-500 text-lg shrink-0"></i>
          <p className="leading-snug">{error}</p>
        </div>
      )}

      <div className="mt-2">
        <button
          type="submit"
          disabled={!stripe || processing || success}
          className="w-full rounded-xl bg-[#0b5f3a] px-6 py-4 text-center font-bold text-white text-lg transition hover:bg-[#084b2e] disabled:opacity-50 shadow-lg shadow-green-900/20 flex justify-center items-center gap-2 group"
        >
          <i className="bi bi-lock-fill text-green-300 group-hover:text-white transition-colors"></i>
          Pagar S/ {total.toFixed(2)}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-1 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <i className="bi bi-shield-check text-[#0b5f3a] text-lg"></i>
          Pago 100% seguro y encriptado
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          Powered by <strong className="text-gray-500">Stripe</strong>
        </div>
      </div>
    </form>
  );
}

export default function PagoStripe() {
  const location = useLocation();
  const navigate = useNavigate();
  // Validamos que venga con un monto desde la página anterior
  const total = parseFloat(location.state?.total || "0");

  if (total <= 0) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col items-center justify-center text-center p-4">
        <i className="bi bi-exclamation-circle text-5xl text-gray-400 mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-800">Error en el pago</h2>
        <p className="text-gray-500 mt-2 mb-6">No se encontró un monto válido para pagar.</p>
        <Link to="/pago" className="px-6 py-3 bg-[#0b5f3a] text-white font-bold rounded-lg hover:bg-[#084b2e] transition">
          Volver a checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 pb-12 flex flex-col">
      <MainNavbar />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 mt-4 md:mt-8">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100 relative">
          
          {/* Header con gradiente */}
          <div className="relative p-8 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white overflow-hidden shrink-0">
            {/* Formas decorativas estilo Stripe */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#635BFF]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#0b5f3a]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-[#635BFF] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 transform -rotate-3 transition hover:rotate-0">
                <i className="bi bi-stripe text-3xl leading-none mt-1"></i>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Pago Seguro con Tarjeta</h1>
              <p className="text-slate-500 text-sm">
                Ingresa los detalles de tu tarjeta para completar tu compra.
              </p>
            </div>
            
            <button 
              onClick={() => navigate(-1)} 
              className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition shadow-sm z-20"
              title="Volver"
            >
              <i className="bi bi-arrow-left text-lg"></i>
            </button>
          </div>

          <div className="p-8">
            {/* Resumen de la orden / Total */}
            <div className="mb-8 bg-green-50/50 border border-green-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Monto a pagar</span>
              <span className="text-4xl font-extrabold text-[#0b5f3a] tracking-tight">S/ {total.toFixed(2)}</span>
            </div>

            {/* Formulario de Stripe */}
            <Elements stripe={stripePromise}>
              <CheckoutForm total={total} />
            </Elements>
          </div>
        </div>
      </main>
    </div>
  );
}
