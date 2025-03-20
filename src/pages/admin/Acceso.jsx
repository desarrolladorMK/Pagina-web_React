import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaSignOutAlt, 
  FaHome, 
  FaClipboardList, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaTruck,
  FaUser,
  FaAppleAlt,
  FaDatabase,
  FaWallet 
} from 'react-icons/fa';
import './Acceso.css';

const Acceso = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { correoUsuario, opciones } = location.state || {};

  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const empleados = import.meta.env.VITE_EMPLEADOS.split(',');
    const nombres = import.meta.env.VITE_EMPLEADOS_NOMBRES.split(',');
    const index = empleados.indexOf(correoUsuario);
    const name = index !== -1 && nombres[index] ? nombres[index] : 'Usuario';
    setUserName(name);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('¡Buenos días');
    else if (hour < 18) setGreeting('¡Buenas tardes');
    else setGreeting('¡Buenas noches');
  }, [correoUsuario]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const iconMap = {
    'Inicio': <FaHome />,
    'Historial': <FaClipboardList />,
    'Gastos': <FaMoneyBillWave />,
    'Reserva de salones': <FaCalendarAlt />,
    'Transporte': <FaTruck />,
    'Perfil gestión humana': <FaUser />,
    'Reposiciones Fruver': <FaAppleAlt />,
    'Base de datos Postulaciones': <FaDatabase />,
    'Historial Cartera': <FaWallet /> 
  };

  return (
    <div className="emp-dashboard">
      <div className="emp-dashboard-header">
        <h2 className="emp-dashboard-title">
          <span className="typing-greeting">{greeting}, {userName}!</span>
        </h2>
        
        <h4 className="fraseMotivacional">
          “La unidad nace cuando dejamos de lado el ‘yo’ para construir el ‘nosotros’.”
        </h4>
  
        <div className="logout-container">
          <div className="logout-icon-wrapper" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span className="logout-label">Cerrar Sesión</span>
          </div>
        </div>
      </div>

      <div className="emp-dashboard-links">
        {opciones && opciones.length > 0 ? (
          opciones.map((opcion, index) => (
            <button
              key={index}
              className="emp-dashboard-button"
              onClick={() => handleNavigation(opcion.path)}
            >
              <span className="button-icon">
                {iconMap[opcion.label] || <FaClipboardList />}
              </span>
              <span className="button-text">{opcion.label}</span>
            </button>
          ))
        ) : (
          <p className="emp-dashboard-no-routes">No tienes rutas disponibles.</p>
        )}
      </div>

      <div className="user-info-container">
        <p className="emp-dashboard-user">
          Has iniciado sesión con: <span>{correoUsuario}</span>
        </p>
      </div>
    </div>
  );
};

export { Acceso };