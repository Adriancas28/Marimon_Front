import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/login.css";

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
      storage.setItem("token", data.token ?? data.Token ?? "");
      storage.setItem("nombre", data.nombre ?? data.Nombre ?? "");

      navigate("/catalogo");
    } catch {
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="login_form">
        <h3>Iniciar Sesión</h3>

        {/* LOGIN CON GOOGLE */}
        <div className="login_option">
          <div className="option">
            <button
              type="button"
              className="social-login-btn"
              onClick={() => {
                console.log("[Login] Iniciando autenticación con Google...");
                window.location.href = "/api/usuario/oauth/google";
              }}
            >
              <div className="google-icon"></div>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>

        <p className="separator">
          <span>o</span>
        </p>

        {/* LOGIN LOCAL */}
        <section className="local-login">
          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input_box">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input_box">
              <div className="password_title">
                <label>Contraseña</label>
                <a href="#" id="forgot-password">¿Olvidaste tu Contraseña?</a>
              </div>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* REMEMBER ME */}
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Recuérdame
              </label>
            </div>

            {/* ERROR */}
            {error && <p className="text-danger">{error}</p>}

            {/* BOTÓN */}
            <button id="login-submit" type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            <p className="sign_up">
              ¿No tienes una cuenta? <a href="#">Registrarse</a>
            </p>
          </form>
        </section>
      </div>

      {/* IMAGEN */}
      <div className="login_image">
        <img src="/images/login.jpeg" alt="Imagen de la empresa" />
      </div>
    </div>
  );
}

export default Login;
