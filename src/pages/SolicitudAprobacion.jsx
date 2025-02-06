// SolicitudAprobacion.jsx
import React, { useState } from "react";
import axios from "axios";
import "./SolicitudAprobacion.css";

const BACKEND_URL = "https://backend-yuli.vercel.app/api";

const SolicitudAprobacion = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    director: "",
    gerencia: "",
    documento: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowId, setWorkflowId] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documento") {
      setFormData({ ...formData, documento: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const formPayload = new FormData();
      formPayload.append("fecha", formData.fecha);
      formPayload.append("documento", formData.documento);
      formPayload.append("director", formData.director);
      formPayload.append("gerencia", formData.gerencia);

      const response = await axios.post(`${BACKEND_URL}/yuli`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setWorkflowId(response.data.workflow_id);
      setMessage("Solicitud enviada correctamente.");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMessage("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="solicitud-container">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="solicitud-header">Descripción de perfil</h1>
      <form onSubmit={handleSubmit} className="solicitud-form">
        <div className="solicitud-form-field">
          <label className="solicitud-label">Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="solicitud-input"
          />
        </div>
        <div className="solicitud-form-field">
          <label className="solicitud-label">Documento (PDF):</label>
          <input
            type="file"
            name="documento"
            accept="application/pdf"
            onChange={handleChange}
            required
            className="solicitud-input"
          />
        </div>
        <div className="solicitud-form-field">
          <label className="solicitud-label">Director (correo):</label>
          <input
            type="email"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
            className="solicitud-input"
          />
        </div>
        <div className="solicitud-form-field">
          <label className="solicitud-label">Gerencia (correo):</label>
          <input
            type="email"
            name="gerencia"
            value={formData.gerencia}
            onChange={handleChange}
            required
            className="solicitud-input"
          />
        </div>
        <button type="submit" className="solicitud-submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && <p className="solicitud-message">{message}</p>}

      {workflowId && (
        <div className="solicitud-info">
          <p>
            Workflow ID: <strong>{workflowId}</strong>
          </p>
          <p>
            Consulta el historial en: {BACKEND_URL}/yuli/{workflowId}
          </p>
        </div>
      )}
    </div>
  );
};

export { SolicitudAprobacion };
