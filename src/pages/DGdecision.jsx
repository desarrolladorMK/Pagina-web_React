// AprobarRechazar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AprobarRechazar.css";

const BACKEND_URL = "https://backend-yuli.vercel.app/api";

const DGdecision = () => {
  const { workflow_id, role } = useParams();
  const [formDetails, setFormDetails] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/yuli/${workflow_id}`);
        setFormDetails(response.data.historial[0]); // Tomar el primer registro
      } catch (error) {
        console.error("Error al obtener detalles del formulario:", error);
      }
    };

    fetchDetails();
  }, [workflow_id]);

  const handleDecision = async (decision) => {
    try {
      // La ruta usa el "role" (director o gerencia) extraído de la URL
      const endpoint = role;
      const response = await axios.post(`${BACKEND_URL}/yuli/${workflow_id}/${endpoint}`, {
        decision,
        observacion: decision === "rechazado" ? "Decisión rechazada automáticamente." : "",
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error al enviar la decisión:", error);
      setMessage("Error al procesar la decisión. Inténtalo de nuevo.");
    }
  };

  if (!formDetails) {
    return <p>Cargando información...</p>;
  }

  return (
    <div className="aprobacion-container">
      <h2>Revisión de Solicitud</h2>
      <p><strong>Fecha:</strong> {formDetails.fecha}</p>
      <p>
        <strong>Documento:</strong>{" "}
        <a href={formDetails.documento} target="_blank" rel="noopener noreferrer">
          Ver Documento
        </a>
      </p>
      <div className="decision-buttons">
        <button className="approve-button" onClick={() => handleDecision("aprobado")}>
          Aprobar
        </button>
        <button className="reject-button" onClick={() => handleDecision("rechazado")}>
          Rechazar
        </button>
      </div>
      {message && <p className="decision-message">{message}</p>}
    </div>
  );
};

export { DGdecision };
