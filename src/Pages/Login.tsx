import { useState } from "react";
import "../Styles/login.css"; // ajusta la ruta según tu proyecto

function Login() {
  // estados (simulan el Model de .NET)
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // proveedores simulados (luego vendrán del backend)
  const externalLogins = [
    { name: "Google", displayName: "Google" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
      rememberMe
    });

    alert("Login simulado");
  };

  return (
    <div className="login_container">
      <div className="login_form">
        <h3>Iniciar Sesión Con</h3>

        {/* LOGIN CON GOOGLE */}
        <div className="login_option">
          {externalLogins.length === 0 ? (
            <div className="option">
              <p className="no-providers">
                No hay servicios de autenticación externos configurados.
              </p>
            </div>
          ) : (
            <div className="option">
              {externalLogins.map((provider) => (
                <button
                  key={provider.name}
                  className="social-login-btn"
                  onClick={() => alert(`Login con ${provider.displayName}`)}
                >
                  {provider.name.toLowerCase().includes("google") && (
                    <div className="google-icon"></div>
                  )}
                  <span>{provider.displayName}</span>
                </button>
              ))}
            </div>
          )}
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
              />
            </div>

            {/* PASSWORD */}
            <div className="input_box">
              <div className="password_title">
                <label>Contraseña</label>
                <a href="#">¿Olvidaste tu Contraseña?</a>
              </div>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* BOTÓN */}
            <button type="submit">Iniciar Sesión</button>

            <p className="sign_up">
              ¿No tienes una cuenta? <a href="#">Registrarse</a>
            </p>
          </form>
        </section>

        {/* DEBUG (opcional) */}
        <div className="debug-info">
          <div className="alert alert-info">
            <p>Proveedores disponibles: {externalLogins.length}</p>
            {externalLogins.map((p) => (
              <p key={p.name}>
                - {p.name} ({p.displayName})
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* IMAGEN */}
      <div className="login_image">
        <img src="/images/login.jpeg" alt="Imagen de la empresa" />
      </div>
    </div>
  );
}

export default Login;