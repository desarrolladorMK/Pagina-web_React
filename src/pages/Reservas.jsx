import React from "react";
import "./Reservas.css";

const Reservas = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Iniciar sesión");
    // Aquí puedes agregar lógica para manejar el inicio de sesión
  };

  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí puedes agregar lógica para manejar el cierre de sesión
  };

  return (
    <div className="reservas-body">
    <div className="reservas-login-container">
      <h2 className="reservas-h2">Inicio de sesión</h2>
      
      <form className="reservas-form" onSubmit={handleLogin}>
        <label htmlFor="username" className="reservas-label">Correo:</label>
        <input type="text" id="emaillog" name="username" className="reservas-input" required />

        <label htmlFor="password" className="reservas-label">Contraseña:</label>
        <input type="password" id="passwordlog" name="password" className="reservas-input" required />

        <button type="submit" className="reservas-button">Ingresar</button>
        <button type="button" className="reservas-button" onClick={handleLogout}>Cerrar Sesión</button>
      </form>
    </div>
    </div>
  );
};

export { Reservas };
