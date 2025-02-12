import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../AprobarRechazar.css";

const BACKEND_URL = "https://backend-yuli.vercel.app/api";

const DGdecision = () => {
  const { workflow_id, role } = useParams();
  const navigate = useNavigate(); // Hook para redirección
  const [formDetails, setFormDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [observacion, setObservacion] = useState(""); // Estado para la observación
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para controlar la redirección

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
        observacion // Se envía la observación junto con la decisión
      });
      setMessage(response.data.message);
      setMessageClass(decision === "aprobado" ? "mensaje-aprobado" : "mensaje-rechazado");
      
      // Activa el estado de redireccionamiento y muestra un mensaje
      setIsRedirecting(true);
      
      // Redirige a la vista "solicitudaprobacion" después de 3 segundos
      setTimeout(() => {
        navigate("/solicitudaprobacion");
      }, 3000);
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
        <p className="fecha">
          <strong>Fecha:</strong> {formDetails.fecha}
        </p>
        <p>
          <strong>Documento:</strong>{" "}
          <a
            className="documento"
            href={formDetails.documento}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Documento
          </a>
        </p>
        <p>
          <strong>Descripción:</strong>{" "}
          {formDetails.descripcion || "Sin descripción"}
        </p>

        {/* Campo para ingresar la observación */}
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
            placeholder="Ingrese la observación, indicando quien la realiza..."
          ></textarea>
        </div>

        <div className="decision-buttons">
          <button
            className="btn-approve"
            onClick={() => handleDecision("aprobado")}
          >
            Necesario
          </button>
          <button
            className="btn-reject"
            onClick={() => handleDecision("rechazado")}
          >
            No necesario
          </button>
        </div>

        {message && <p className={messageClass}>{message}</p>}
        {isRedirecting && <p>Redireccionando, por favor espere...</p>}
      </div>
    </div>
  );
};

export { DGdecision };
