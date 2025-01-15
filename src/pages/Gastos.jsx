import React, { useState, useEffect } from "react";
import './Gastos.css';

const Gastos = () => {
  const [formData, setFormData] = useState({
    empleado_id: "", // Asegúrate de agregar este campo, probablemente deberías obtenerlo desde el usuario autenticado.
    nombre_completo: "",
    descripcion: "",
    monto_estimado: "", // Cambié "precio" por "monto_estimado"
    archivo_factura: "", // Cambié "factura" por "archivo_factura"
    archivo_cotizacion: "", // Cambié "cotizacion" por "archivo_cotizacion"
    correo_empleado: "",  // Cambié el nombre del campo aquí
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [decision, setDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = 'https://backend-gastos.vercel.app/api';

  const checkDecision = async () => {
    try {
      const response = await fetch(`${API_URL}/requerimientos/estado/${token}`);
      if (response.ok) {
        const data = await response.json();
        setDecision(data.decision);
      } else {
        setErrorMessage("No se pudo obtener el estado de la solicitud.");
      }
    } catch (error) {
      console.error("Error al obtener el estado de la solicitud:", error);
      setErrorMessage("Hubo un error al obtener el estado.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/requerimientos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsSubmitted(true);
        alert("Requerimiento enviado con éxito.");
      } else {
        alert("Error al enviar el requerimiento.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Hubo un error al enviar la solicitud.");
    }
  };

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        checkDecision();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="gastos-container">
      <h1 className="gastos-header">Automatización de Gasto</h1>

      {!isSubmitted ? (
        <div className="gastos-form-container">
          <h2 className="gastos-form-title">Formulario de Solicitud de Gasto</h2>
          <form onSubmit={handleSubmit} className="gastos-form">
            <div className="gastos-form-field">
              <label className="gastos-label">Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Monto Estimado:</label>
              <input
                type="number"
                name="monto_estimado"
                value={formData.monto_estimado}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Factura (URL o archivo):</label>
              <input
                type="text"
                name="archivo_factura"
                value={formData.archivo_factura}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Cotización (URL o archivo):</label>
              <input
                type="text"
                name="archivo_cotizacion"
                value={formData.archivo_cotizacion}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <div className="gastos-form-field">
              <label className="gastos-label">Correo del Solicitante:</label>
              <input
                type="email"
                name="correo_empleado" // Cambié el nombre del campo aquí
                value={formData.correo_empleado} // Cambié el valor aquí
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>
            <button type="submit" className="gastos-submit-button">Enviar</button>
          </form>
        </div>
      ) : (
        <div className="gastos-submitted-message">
          <h2>Solicitud enviada exitosamente</h2>
          <p>Tu solicitud de gasto ha sido enviada. El token de la solicitud es: <strong>{token}</strong></p>
        </div>
      )}

      {decision && (
        <div className="gastos-decision-message">
          <h3>La solicitud ha sido {decision === 'Aprobado' ? 'aprobada' : 'rechazada'}</h3>
        </div>
      )}

      {errorMessage && (
        <div className="gastos-error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export { Gastos };
