import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/usuario/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      if (response.ok) {
        setMessage("Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.");
      } else {
        setError("No pudimos procesar tu solicitud. Verifica que el correo sea correcto.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold uppercase tracking-wide text-[#e11d2e] inline-block mb-6">
            Marimon
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recuperar Acceso</h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-slate-100">
          {!message ? (
            <>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 text-center font-medium">
                ¿Perdiste tu contraseña? Por favor, introduce tu correo electrónico. 
                Recibirás un enlace para crear una contraseña nueva por correo.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#e11d2e] py-4 font-bold text-white transition-all hover:bg-[#be1020] hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Restablecer Contraseña"}
                </button>

                <div className="text-center pt-4">
                  <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-red-600 transition-colors">
                    <i className="bi bi-arrow-left mr-2"></i> Volver al Inicio de Sesión
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="bi bi-envelope-check-fill"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">¡Correo Enviado!</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {message}
              </p>
              <p className="text-xs text-slate-400 mb-8 italic">
                Si no encuentras el correo, verifica en la carpeta de spam o correo no deseado.
              </p>
              <Link 
                to="/login" 
                className="inline-block w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-black"
              >
                Entendido
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
