import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para redirección

  const handleLogin = (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;
    const password = event.target.password.value;

    // Datos quemados
    const usuarioValido = {
      correo: "merkahorro@gmail.com",
      password: "123456",
    };

    if (correo === usuarioValido.correo && password === usuarioValido.password) {
      console.log("Inicio de sesión exitoso");
      setError("");
      navigate("/salones"); // Redirigir a la página de salones
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
