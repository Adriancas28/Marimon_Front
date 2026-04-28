import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registro() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/usuario/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          contraseña: password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        setError(msg || "Ocurrió un error al registrarse.");
        return;
      }

      // Si el registro es exitoso, redirigir al login
      navigate("/");
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-red-50 flex items-center justify-center p-4 lg:p-10">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        
        {/* Lado izquierdo - Formulario */}
        <section className="w-full p-8 sm:p-12 lg:w-1/2">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Marimon
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Crear una nueva cuenta</h1>
            <p className="mt-2 text-sm text-slate-500">
              Únete para explorar nuestro catálogo y acceder a funciones exclusivas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
               <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
               <input
                 type="password"
                 placeholder="Crea una contraseña"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
               />
            </div>

            <div>
               <label className="mb-1 block text-sm font-medium text-slate-700">Confirmar Contraseña</label>
               <input
                 type="password"
                 placeholder="Repite la contraseña"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
                 className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
               />
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>

            <p className="text-center text-sm text-slate-500 pt-2">
              ¿Ya tienes cuenta?{" "}
              <Link to="/" className="font-semibold text-red-600 hover:text-red-700">
                Iniciar Sesión
              </Link>
            </p>
          </form>
        </section>

        {/* Lado derecho - Imagen */}
        <section className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 lg:block">
          <img
            src={`${import.meta.env.BASE_URL}images/register.jpg`}
            alt="Imagen decorativa de registro"
            className="h-full w-full object-cover opacity-80 mix-blend-multiply"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 flex items-end p-10">
            <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white">Únete a nuestra comunidad</h2>
              <p className="mt-2 text-sm text-red-50">
                Regístrate y adquiere rápidamente los mejores repuestos para tu vehículo.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Registro;
