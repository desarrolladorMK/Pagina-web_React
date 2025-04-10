import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { guardarToken } from "../../helpers/funciones";
import credenciales from "../../helpers/credenciales"; 

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si hay un token, intentar decodificarlo y redirigir
      try {
        const decoded = atob(token).split(":");
        const correo = decoded[0];
        const password = decoded[1];

        const usuarioValido = credenciales.find(
          (cred) => cred.correo === correo && cred.password === password
        );

        if (usuarioValido) {
          navigate(usuarioValido.redirect, {
            state: {
              correoUsuario: correo,
              opciones: usuarioValido.routes || [],
            },
          });
        }
      } catch (error) {
        // Si el token es inválido, eliminarlo
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const correo = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    if (!correo || !password) {
      setError("Por favor, complete todos los campos");
      setLoading(false);
      return;
    }

    const usuarioValido = credenciales.find(
      (credencial) => credencial.correo === correo && credencial.password === password
    );

    try {
      if (usuarioValido) {
        const token = btoa(`${correo}:${password}`); // Crear un token único
        guardarToken(token); // Guardar el token en localStorage
        localStorage.setItem("correo_empleado", correo); // Guardar el correo en localStorage
        localStorage.setItem("rutas_permitidas", JSON.stringify(usuarioValido.routes || [])); // Guardar las rutas permitidas
        navigate(usuarioValido.redirect, {
          state: {
            correoUsuario: correo,
            opciones: usuarioValido.routes || [],
          },
        });
      } else {
        setError("Correo o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="body-login">
      <div className="logo-containermk">
        <a href="/">
          <img src="/logoMK.webp" alt="Logo" className="logo-animated" />
        </a>
      </div>
      <div className="grad"></div>
      <div className="login-box">
        <form className="form-login" onSubmit={handleLogin}>
          <div className="user-box">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              autoFocus
              className={`input-animated ${emailFocus ? "focused" : ""}`}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <label>Correo Electrónico</label>
            <span className="input-border"></span>
          </div>
          <div className="user-box password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              className={`input-animated ${passwordFocus ? "focused" : ""}`}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <label>Contraseña</label>
            <span className="input-border"></span>
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <svg
                className={`eye-icon ${showPassword ? "active" : ""}`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c-7 0-11 8-11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <button type="submit" className="ingresar-login" disabled={loading}>
            <span className="button-text">
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </span>
            <span className="button-arrow">→</span>
          </button>
        </form>
        {error && <p className="error-login animate-error">{error}</p>}
      </div>
    </div>
  );
};

export { Login };