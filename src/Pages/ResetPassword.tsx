import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase envía el token en el Hash (#) de la URL
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setToken(accessToken);
      } else {
        setError("El enlace de recuperación es inválido o ha expirado.");
      }
    } else {
      setError("No se encontró un token de seguridad válido.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/usuario/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: token,
          nuevaContraseña: password 
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const msg = await response.text();
        setError(msg || "No se pudo actualizar la contraseña. El enlace puede haber expirado.");
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
          <p className="text-2xl font-extrabold uppercase tracking-wide text-[#e11d2e] inline-block mb-6">
            Marimon
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nueva Contraseña</h1>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-8 sm:p-10 border border-slate-100">
          {success ? (
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">¡Contraseña Actualizada!</h2>
              <p className="text-slate-500 text-sm">
                Tu contraseña ha sido cambiada con éxito. Redirigiendo al inicio de sesión...
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm text-center mb-8 font-medium">
                Por favor, ingresa tu nueva contraseña a continuación.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-red-500/10 focus:border-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  disabled={loading || !token}
                  className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-black hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Actualizando..." : "Guardar Nueva Contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
