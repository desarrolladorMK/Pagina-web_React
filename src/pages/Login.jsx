import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirección

  // Verificar que las variables de entorno se están cargando correctamente
  console.log("Correo 1 esperado:", import.meta.env.VITE_LOGIN_EMAIL_1);
  console.log("Contraseña 1 esperada:", import.meta.env.VITE_LOGIN_PASSWORD_1);
  console.log("Correo 2 esperado:", import.meta.env.VITE_LOGIN_EMAIL_2);
  console.log("Contraseña 2 esperada:", import.meta.env.VITE_LOGIN_PASSWORD_2);

  const handleLogin = (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;
    const password = event.target.password.value;

    // Datos obtenidos del archivo .env para múltiples usuarios
    const credenciales = [
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_1 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_1 || "",
        redirect: import.meta.env.VITE_LOGIN_REDIRECT_1 || "/",
      },
      {
        correo: import.meta.env.VITE_LOGIN_EMAIL_2 || "",
        password: import.meta.env.VITE_LOGIN_PASSWORD_2 || "",
        redirect: import.meta.env.VITE_LOGIN_REDIRECT_2 || "/",
      },
    ];

    // Buscar las credenciales correctas
    const usuarioValido = credenciales.find(
      (credencial) => credencial.correo === correo && credencial.password === password
    );

    if (usuarioValido) {
      console.log("Inicio de sesión exitoso");
      setError("");
      navigate(usuarioValido.redirect); // Redirigir a la ruta especificada
    } else {
      console.log("Inicio de sesión fallido");
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="body-login">
      <div className="logo-containermk">
        <a href="/">
          <img src="/logoMK.png" alt="Logo" />
        </a>
      </div>
      <div className="grad"></div>
      <div className="login-box">
        <h2>Inicio De Sesión</h2>
        <form className="form-login" onSubmit={handleLogin}>
          <div className="user-box">
            <input type="text" name="correo" required />
            <label>Correo</label>
          </div>
          <div className="user-box">
            <input type="password" name="password" required />
            <label>Contraseña</label>
          </div>
          <button type="submit" className="ingresar-login">Ingresar</button>
        </form>
        {error && <p className="error-login">{error}</p>}
      </div>
    </div>
  );
};

export { Login };
