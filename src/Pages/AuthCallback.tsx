import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Procesando autenticación...");
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    console.log("[AuthCallback] URL hash recibido:", hash);

    // Supabase devuelve: #access_token=xxx&token_type=bearer&...
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const errorDesc = params.get("error_description");

    if (errorDesc) {
      console.error("[AuthCallback] Error de OAuth:", errorDesc);
      setError(`Error de Google: ${errorDesc}`);
      return;
    }

    if (!accessToken) {
      console.error("[AuthCallback] No se encontró access_token en el hash:", hash);
      setError("No se recibió token de Google. Verifica la configuración de Supabase.");
      return;
    }

    console.log("[AuthCallback] Token recibido, llamando al backend...");
    setStatus("Verificando con el servidor...");

    fetch("/api/usuario/login-google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: accessToken }),
    })
      .then(async (res) => {
        const text = await res.text();
        console.log("[AuthCallback] Respuesta del backend:", res.status, text);

        if (!res.ok) {
          throw new Error(text || "Error al autenticar con el servidor");
        }

        const data = JSON.parse(text);
        sessionStorage.setItem("id", data.id ?? data.Id ?? "");
        sessionStorage.setItem("token", data.token ?? data.Token ?? "");
        sessionStorage.setItem("nombre", data.nombre ?? data.Nombre ?? "");
        sessionStorage.setItem("correo", data.correo ?? data.Correo ?? "");

        console.log("[AuthCallback] Login exitoso, redirigiendo a /inicio");
        navigate("/inicio");
      })
      .catch((err) => {
        console.error("[AuthCallback] Error al llamar al backend:", err);
        setError(err.message);
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4">
      {error ? (
        <>
          <p className="max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-red-700">
            {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
          >
            Volver al Login
          </button>
        </>
      ) : (
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl ring-1 ring-slate-200">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
          <p className="text-base font-medium text-slate-700">{status}</p>
        </div>
      )}
    </div>
  );
}

export default AuthCallback;
