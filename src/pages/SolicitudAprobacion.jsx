import React, { useState } from "react";
import axios from "axios";
import "./SolicitudAprobacion.css";


const BACKEND_URL = "https://backend-yuli.vercel.app/api"; 
const SUPABASE_BUCKET = "https://pitpougbnibmfrjykzet.supabase.co/storage/v1/object/public/pdfs-yuli/";

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

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documento") {
      setFormData({ ...formData, documento: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Función para subir el archivo a Supabase Storage y obtener la URL pública
  const uploadFile = async (file) => {
    if (!file) return "";
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(fileName, file);
    if (error) {
      console.error("Error al subir el archivo:", error);
      return "";
    }
    // Obtener la URL pública del archivo
    const { publicURL, error: publicUrlError } = supabase.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(fileName);
    if (publicUrlError) {
      console.error("Error al obtener la URL pública:", publicUrlError);
      return "";
    }
    return publicURL;
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Subir el archivo y obtener la URL pública
      const documentoUrl = await uploadFile(formData.documento);
      if (!documentoUrl) {
        setMessage("Error al subir el documento.");
        setIsSubmitting(false);
        return;
      }

      // Armar el payload para enviar al backend
      const payload = {
        fecha: formData.fecha,
        documento: documentoUrl,
        director: formData.director,
        gerencia: formData.gerencia,
      };

      // Enviar los datos al backend
      const response = await axios.post(`${BACKEND_URL}/yuli`, payload, {
        headers: { "Content-Type": "application/json" },
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
      <h1 className="solicitud-header">Solicitud de Aprobación</h1>
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

export {SolicitudAprobacion};
