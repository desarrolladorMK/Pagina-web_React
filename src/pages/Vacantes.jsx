import React from 'react';
import './Vacantes.css';
import { ChatBot } from '../components/ChatBot';

const Vacantes = () => {
  const vacantesActivas = false; // Cambia a false para ocultar las vacantes

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
            <div className="no-vacantes-content">
              <h3 className="mensaje-titulo">¡Estamos creciendo!</h3>
              <p className="mensaje-vacantes">
                Actualmente no hay vacantes disponibles, pero siempre estamos buscando talento. Envíanos tu hoja de vida y te contactaremos cuando surja una oportunidad perfecta para ti.
              </p>
              <div className="vacante-footer">
                <a href="/aplicar" className="btn-aplicar aplicar-color">¡Postularme!</a>
              </div>
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