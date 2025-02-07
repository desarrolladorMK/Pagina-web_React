import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AprobarRechazar.css";

const BACKEND_URL = "https://backend-yuli.vercel.app/api";

const DGdecision = () => {
  const { workflow_id, role } = useParams();
  const [formDetails, setFormDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [observacion, setObservacion] = useState(""); // Campo para la observación

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/yuli/${workflow_id}`);
        setFormDetails(response.data.historial[0]); 
      } catch (error) {
        console.error("Error al obtener detalles del formulario:", error);
      }
    };

    fetchDetails();
  }, [workflow_id]);

  const handleDecision = async (decision) => {
    try {
      const endpoint = role;
      const response = await axios.post(`${BACKEND_URL}/yuli/${workflow_id}/${endpoint}`, {
        decision,
        observacion,  // Enviamos la observación escrita por el usuario (si hay)
      });
      setMessage(response.data.message);
      setMessageClass(decision === "aprobado" ? "mensaje-aprobado" : "mensaje-rechazado");
    } catch (error) {
      console.error("Error al enviar la decisión:", error);
      setMessage("Error al procesar la decisión. Inténtalo de nuevo.");
      setMessageClass("mensaje-rechazado");
    }
  };

  if (!formDetails) {
    return <p>Cargando información...</p>;
  }

  return (
    <div className="aprobar-rechazar-container">
      <div className="logo-container-aprobar">
        <a href="/">
          <img src="/logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="header-gastos">Revisión de Solicitud</h1>
      <div className="form">
        <p className="fecha"><strong>Fecha:</strong> {formDetails.fecha}</p>
        <p>
          <strong>Documento:</strong>{" "}
          <a className="documento" href={formDetails.documento} target="_blank" rel="noopener noreferrer">
            Ver Documento
          </a>
        </p>

        {/* Campo para escribir la observación */}
        <div className="observacion-field">
          <label><strong>Observación:</strong></label>
          <textarea 
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Escribe una observación si es necesario..."
            rows="3"
            className="observacion-textarea"
          />
        </div>

        <div className="decision-buttons">
          <button className="btn-approve" onClick={() => handleDecision("aprobado")}>
            Aprobar
          </button>
          <button className="btn-reject" onClick={() => handleDecision("rechazado")}>
            Rechazar
          </button>
        </div>

        {message && <p className={messageClass}>{message}</p>}
      </div>
    </div>
  );
};

export { DGdecision };
