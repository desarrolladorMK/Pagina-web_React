import React, { useState, useEffect } from "react";
import axios from "axios";
import "../flujo_perfil/SolicitudAprobacion.css";

const BACKEND_URL = "https://backend-yuli.vercel.app/api";

const SolicitudAprobacion = () => {
  // Estados del formulario y de la aplicación
  const [formData, setFormData] = useState({
    fecha: "",
    director: "",
    gerencia: "",
    documento: null,
    descripcion: "", // nuevo campo de descripción
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowId, setWorkflowId] = useState("");
  const [message, setMessage] = useState("");
  const [historial, setHistorial] = useState([]);

  // Cargar historial al iniciar el componente
  useEffect(() => {
    fetchHistorial();
  }, []);

  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documento") {
      setFormData({ ...formData, documento: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Envío del formulario
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
      formPayload.append("descripcion", formData.descripcion); // incluir descripción

      const response = await axios.post(`${BACKEND_URL}/yuli`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const workflowId = response.data.workflow_id;
      setWorkflowId(workflowId);
      setMessage("Solicitud enviada correctamente.");
      fetchHistorial(); // Recargar historial después de enviar
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMessage(
        "Error al enviar la solicitud. Por favor, inténtalo de nuevo."
      );
    }
    setIsSubmitting(false);
  };

  // Obtener historial completo desde el backend
  const fetchHistorial = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/yuli`);

      setHistorial(response.data.historial);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
    }
  };

  // Función que asigna la clase CSS según el estado
  const getEstadoClass = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("aprobado por director")) {
      return "estado-aprobado-director";
    } else if (
      estadoLower.includes("aprobado por ambos") ||
      estadoLower === "aprobado"
    ) {
      return "estado-aprobado-ambos";
    } else if (estadoLower.includes("rechazado")) {
      return "solicitud-rechazado";
    } else if (estadoLower.includes("pendiente")) {
      return "solicitud-pendiente";
    }
    return "";
  };

  const getEstadoLabel = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes("aprobado por director")) {
      return "necesario por director";
    } else if (
      estadoLower.includes("aprobado por ambos") ||
      estadoLower === "aprobado"
    ) {
      return "necesario por ambos";
    } else if (estadoLower.includes("rechazado")) {
      return "no necesario";
    } else if (estadoLower.includes("pendiente")) {
      return "pendiente";
    }
    return estado;
  };

  return (
    <div className="solicitud-aprobacion-container">
      <div className="logo-container-solicitud">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1 className="solicitud-aprobacion-header">Descripción de Perfil</h1>

      {/* Formulario de Solicitud */}
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
          <label className="solicitud-aprobacion-label">Documento:</label>
          <input
            type="file"
            name="documento"
            accept=".pdf, .doc, .docx, .xls, .xlsx"
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          />
        </div>
        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">
            Director de Área:
          </label>
          <select
            name="director"
            value={formData.director}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          >
            <option value="">--Seleccione--</option>
            <option value="operaciones@merkahorrosas.com">
              Ramiro Hincapié
            </option>
            <option value="contabilidad1@merkahorrosas.com">Ana Herrera</option>
            <option value="gestionhumana@merkahorrosas.com">
              Yuliana Garcia
            </option>
            <option value="analista@merkahorrosas.com">Anny Solarte</option>
            <option value="operacionescomerciales@merkahorrosas.com">
              Andrés Gómez
            </option>
            <option value="sistemas@merkahorrosas.com">
              Yonatan Valencia
            </option>
            <option value="compras@merkahorrosas.com">Julián Hurtado</option>
            <option value="carteraytesoreria@merkahorrosas.com">
              Carolina Hernández
            </option>
            
          </select>
        </div>

        <div className="solicitud-aprobacion-form-field">
          <label className="solicitud-aprobacion-label">
            Gerencia General:
          </label>
          <select
            name="gerencia"
            value={formData.gerencia}
            onChange={handleChange}
            required
            className="solicitud-aprobacion-input"
          >
            <option value="">--Seleccione--</option>
            <option value="gerencia@merkahorrosas.com">Diego Salazar</option>
            <option value="gerencia1@merkahorrosas.com">Steven Salazar</option>
            <option value="gerencia@megamayoristas.com">Adrián Hoyos</option>
            <option value="gerencia@construahorrosas.com">William Salazar </option>
            

           
           
          </select>
        </div>

        <button
          type="submit"
          className="solicitud-aprobacion-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </button>
      </form>

      {message && <p className="solicitud-aprobacion-message">{message}</p>}

      {/* Historial de Solicitudes */}
      {historial.length > 0 && (
        <div className="solicitud-aprobacion-historial-container">
          <h2 className="solicitud-aprobacion-historial-header">
            Historial de Solicitudes
          </h2>
          <table className="solicitud-aprobacion-historial-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, index) => (
                <tr key={index}>
                  <td>{item.fecha}</td>
                  <td>{item.descripcion || "Sin descripción"}</td>
                  <td>
                    <span className={getEstadoClass(item.estado)}>
                      {getEstadoLabel(item.estado)}
                      {item.estado.toLowerCase().includes("rechazado") &&
                      item.rechazadoPor
                        ? ` (por ${item.rechazadoPor})`
                        : ""}
                    </span>
                  </td>
                  <td>{item.observacion || "Sin observación"}</td>
                  <td>
                    {item.documento ? (
                      <a
                        href={item.documento}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </a>
                    ) : (
                      "Sin PDF"
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
