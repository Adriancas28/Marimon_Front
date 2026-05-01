import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Correo o contraseña incorrectos.");
        return;
      }

      const data = await response.json();

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("id", data.id ?? data.Id ?? "");
      storage.setItem("token", data.token ?? data.Token ?? "");
      storage.setItem("nombre", data.nombre ?? data.Nombre ?? "");
      storage.setItem("correo", data.correo ?? data.Correo ?? email);

      navigate("/inicio");
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-red-50 flex items-center justify-center p-4 lg:p-10">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <section className="w-full p-8 sm:p-12 lg:w-1/2">
          <div className="mb-8 text-center">
            <p className="text-xl font-extrabold uppercase tracking-wide text-[#e11d2e]">
              Marimon
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Iniciar Sesión</h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Gestiona tus pedidos y mantén tu vehículo al día.
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            onClick={() => {
              console.log("[Login] Iniciando autenticación con Google...");
              window.location.href = "/api/usuario/oauth/google";
            }}
          >
            <img
              src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span>Continuar con Google</span>
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase text-slate-400">o</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                <Link to="/olvido-clave" className="text-xs font-medium text-slate-500 hover:text-red-600">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              Recuérdame
            </label>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>

            <p className="text-center text-sm text-slate-500">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro" className="font-semibold text-red-600 hover:text-red-700">
                Registrarse
              </Link>
            </p>
          </form>
        </section>

        <section className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 lg:block">
          <img
            src={`${import.meta.env.BASE_URL}images/login.jpeg`}
            alt="Imagen de la empresa"
            className="h-full w-full object-cover opacity-80 mix-blend-multiply"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 flex items-end p-10">
            <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white">Autopartes de calidad</h2>
              <p className="mt-2 text-sm text-red-50">
                Compra con confianza y encuentra todo lo que tu vehículo necesita.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
