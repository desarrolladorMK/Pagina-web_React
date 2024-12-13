import React from "react";
import "./Reservas.css";

const Reservas = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Iniciar sesión");
    // Aquí puedes agregar lógica para manejar el inicio de sesión
  };

  return (
    <div className="body-login">
      <div className="logo-containermk">
      <a href="/"> <img src="/logoMK.png" alt="" /></a> 
      </div>
      <div className="grad"></div>
      <div className="login-box">
        <h2>Inicio De Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="user-box">
            <input type="text" name="correo" required />
            <label>Correo</label>
          </div>
          <div className="user-box">
            <input type="password" name="password" required />
            <label>Contraseña</label>
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export { Reservas };
