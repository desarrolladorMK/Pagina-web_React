import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AprobarRechazar.css';

// Custom Hook para manejar la lógica
const useDecisionHandler = (initialToken) => {
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [decisionTomada, setDecisionTomada] = useState(false);
  const [observacion, setObservacion] = useState('');

  const handleSubmit = async (decision) => {
    if (!observacion.trim()) {
      setMensaje('Por favor, ingresa una observación.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://backend-gastos.vercel.app/api/requerimientos/decidirRequerimiento',
        { token: initialToken, decision, observacion }
      );
      setMensaje(response.data.message);
      setDecisionTomada(true);
      setEstado(decision === 'Necesario' ? 'aprobado' : 'rechazado');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al enviar la decisión.';
      setMensaje(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    estado,
    mensaje,
    setMensaje, // Exponemos setMensaje
    loading,
    decisionTomada,
    observacion,
    setObservacion,
    handleSubmit,
  };
};

// Componente reutilizable para botones
const DecisionButton = ({ label, onClick, disabled, type }) => (
  <button
    type="button"
    className={`decision-btn btn-${type}`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

const AprobarRechazar = () => {
  const [token, setToken] = useState('');
  const {
    estado,
    mensaje,
    setMensaje, // Extraemos setMensaje
    loading,
    decisionTomada,
    observacion,
    setObservacion,
    handleSubmit,
  } = useDecisionHandler(token);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (!tokenFromUrl) {
      setMensaje('Token no encontrado en la URL.');
    }
    setToken(tokenFromUrl);
  }, [setMensaje]); // Agregamos setMensaje como dependencia

  return (
    <div className="aprobar-rechazar-container">
      <div className="logo-container-aprobar">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="header-gastos">Decidir Requerimiento de Gasto</h1>
      <div className="form" aria-disabled={loading}>
        {!decisionTomada ? (
          <>
            <div className="form-group">
              <label htmlFor="observacion" className="form-label">
                Observación:
              </label>
              <textarea
                id="observacion"
                name="observacion"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="observacion-input"
                placeholder="Importante: decir quién está realizando la observación."
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <div className="decision-buttons">
                <DecisionButton
                  label="Necesario"
                  onClick={() => handleSubmit('Necesario')}
                  disabled={loading}
                  type="approve"
                />
                <DecisionButton
                  label="No necesario"
                  onClick={() => handleSubmit('No necesario')}
                  disabled={loading}
                  type="reject"
                />
              </div>
            </div>
          </>
        ) : (
          <p className={`mensaje mensaje-${estado}`}>{mensaje}</p>
        )}
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
};

export { AprobarRechazar };