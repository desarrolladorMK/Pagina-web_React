import React from 'react';
import './Vacantes.css';
import { ChatBot } from '../components/ChatBot';

const Vacantes = () => {
  const vacantesActivas = true; // Cambia a false para ocultar las vacantes

  return (
    <div className="vacantes-body">
      <div className="logo-container">
        <a href="/">
          <img src="/logoMK.png" alt="Logo" className="logo-vacantes" />
        </a>
      </div>

      <div className="vacantes-container">
        <h2 className="titulo-vacantes">Vacantes Disponibles</h2>
        {vacantesActivas ? (
          <div id="vacantes-grid" className="vacantes-grid">
            <div className="vacante-card">
              <img src="/convo1.jpeg" alt="Vacante 1" className="vacante-card-img" />
              <div className="vacante-footer">
                <a href="/aplicar" className="btn-aplicar aplicar-color">Aplicar</a>
              </div>
            </div>
            <div className="vacante-card">
              <img src="/convo.jpeg" alt="Vacante 2" className="vacante-card-img" />
              <div className="vacante-footer">
                <a href="/aplicar" className="btn-aplicar aplicar-color">Aplicar</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-vacantes">
            <h2 className="mensaje-vacantes">
              En estos momentos no hay vacantes específicas disponibles, pero puedes enviarnos tu hoja de vida.
            </h2>
            <div className="vacante-footer">
              <a href="/aplicar" className="btn-aplicar aplicar-color">Aplicar</a>
            </div>
          </div>
        )}
      </div>

      <div className="floating-buttons">
        <ChatBot showInviteMessage={false} />
      </div>
    </div>
  );
};

export { Vacantes };