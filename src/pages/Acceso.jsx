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
    <div className="admin-dashboard">
      <h2>Bienvenido al Panel de Administración</h2>
      <p>Correo: {correoUsuario}</p>
      <div className="dashboard-links">
        {opciones && opciones.length > 0 ? (
          opciones.map((opcion, index) => (
            <button key={index} onClick={() => handleNavigation(opcion.path)}>
              {opcion.label}
            </button>
          ))
        ) : (
          <p>No tienes rutas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export { Acceso };
