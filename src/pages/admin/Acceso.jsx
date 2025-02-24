import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Acceso.css';

const Acceso = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener correo y rutas pasadas por el login
  const { correoUsuario, opciones } = location.state || {};

  const handleNavigation = (path) => {
    navigate(path); // Redirige a la vista seleccionada
  };

  return (
    <div className="emp-dashboard">
      <h2 className="emp-dashboard-title">Bienvenido al Panel de Administración</h2>
      <h4 className="fraseMotivacional">
      “La unidad nace cuando dejamos de lado el ‘yo’ para construir el ‘nosotros’.”
          </h4>
      <p className="emp-dashboard-user">Ingresaste como: {correoUsuario}</p>
      <div className="emp-dashboard-links">
        {opciones && opciones.length > 0 ? (
          opciones.map((opcion, index) => (
            <button
              className="emp-dashboard-button"
              key={index}
              onClick={() => handleNavigation(opcion.path)}
            >
              {opcion.label}
            </button>
          ))
        ) : (
          <p className="emp-dashboard-no-routes">No tienes rutas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export { Acceso };
