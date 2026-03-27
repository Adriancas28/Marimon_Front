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
        sessionStorage.setItem("token", data.token ?? data.Token ?? "");
        sessionStorage.setItem("nombre", data.nombre ?? data.Nombre ?? "");

        console.log("[AuthCallback] Login exitoso, redirigiendo a /catalogo");
        navigate("/catalogo");
      })
      .catch((err) => {
        console.error("[AuthCallback] Error al llamar al backend:", err);
        setError(err.message);
      });
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: "16px" }}>
      {error ? (
        <>
          <p style={{ color: "#e22122", fontSize: "1.1rem" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            style={{ padding: "10px 20px", backgroundColor: "#e22122", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Volver al Login
          </button>
        </>
      ) : (
        <p style={{ fontSize: "1.1rem", color: "#333" }}>{status}</p>
      )}
    </div>
  );
}

export default AuthCallback;
