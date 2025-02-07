import React, { useState, useEffect } from "react";
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
  const [historial, setHistorial] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedObservacion, setEditedObservacion] = useState("");

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

      const workflowId = response.data.workflow_id;
      setWorkflowId(workflowId);
      setMessage("Solicitud enviada correctamente.");
      fetchHistorial(workflowId);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMessage("Error al enviar la solicitud. Por favor, inténtalo de nuevo.");
    }
    setIsSubmitting(false);
  };

  const fetchHistorial = async (workflowId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/yuli/${workflowId}`);
      setHistorial(response.data.historial);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
    }
  };

  const handleEdit = (index, observacion) => {
    setEditIndex(index);
    setEditedObservacion(observacion);
  };

  const handleSave = async (index) => {
    const updatedHistorial = [...historial];
    updatedHistorial[index].observacion = editedObservacion;

    try {
      await axios.put(`${BACKEND_URL}/yuli/${updatedHistorial[index].workflow_id}`, {
        observacion: editedObservacion,
      });

      setHistorial(updatedHistorial);
      setEditIndex(null);
      setEditedObservacion("");
    } catch (error) {
      console.error("Error al actualizar la observación:", error);
    }
  };

  return (
    <div className="solicitud-aprobacion-container">
      <div className="solicitud-aprobacion-logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="solicitud-aprobacion-header">Solicitud de Aprobación</h1>
      <form onSubmit={handleSubmit} className="solicitud-aprobacion-form">
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">Documento (PDF):</label>
          <input
            type="file"
            name="documento"
            accept="application/pdf"
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">Director (correo):</label>
          <input
            type="email"
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">Gerencia (correo):</label>
          <input
            type="email"
            name="gerencia"
            value={formData.gerencia}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <button type="submit" className="solicitud-aprobacion-submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && <p className="solicitud-aprobacion-message">{message}</p>}

      {workflowId && (
        <div className="solicitud-aprobacion-info">
          <p>
            Workflow ID: <strong>{workflowId}</strong>
          </p>
          <p>
            Consulta el historial en: {BACKEND_URL}/yuli/{workflowId}
          </p>
        </div>
      )}

      {historial.length > 0 && (
        <div className="solicitud-aprobacion-historial-container">
          <h2 className="solicitud-aprobacion-historial-header">Historial de Solicitud</h2>
          <table className="solicitud-aprobacion-historial-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, index) => (
                <tr key={index}>
                  <td>{item.fecha}</td>
                  <td>{item.estado}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editedObservacion}
                        onChange={(e) => setEditedObservacion(e.target.value)}
                      />
                    ) : (
                      item.observacion || 'Sin observación'
                    )}
                  </td>
                  <td>{item.role}</td>
                  <td>
                    {editIndex === index ? (
                      <button onClick={() => handleSave(index)}>Guardar</button>
                    ) : (
                      <button onClick={() => handleEdit(index, item.observacion)}>Editar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { SolicitudAprobacion };
