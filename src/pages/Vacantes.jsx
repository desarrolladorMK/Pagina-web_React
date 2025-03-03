import React from 'react';
import './Vacantes.css'; // Asegúrate de importar el archivo CSS

const Vacantes = () => {
  const vacantesActivas = false; // Cambia a false para ocultar las vacantes

  return (
    <div>
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
            {/* Agrega más vacantes según necesites */}
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
    </div>
  );
};

export { Vacantes };
