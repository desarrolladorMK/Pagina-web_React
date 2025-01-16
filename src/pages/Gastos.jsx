import React, { useState, useEffect } from "react";
import './Gastos.css';

const Gastos = () => {
  const [formData, setFormData] = useState({ 
    nombre_completo: "",
    area: "",
    descripcion: "",
    monto_estimado: "",
    archivo_factura: "",
    archivo_cotizacion: "",
    correo_empleado: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [decision, setDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

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

  const obtenerHistorial = async () => {
    try {
      const response = await fetch(`${API_URL}/requerimientos`);
      if (response.ok) {
        const { data } = await response.json();
        setHistorial(data);
        setMostrarHistorial(!mostrarHistorial);

        // Scroll automático al historial
        if (!mostrarHistorial) {
          setTimeout(() => {
            const historialElement = document.getElementById("gastos-historial");
            if (historialElement) {
              historialElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 300);
        }
      } else {
        alert("Error al obtener el historial de gastos.");
      }
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      alert("Hubo un error al cargar el historial.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "monto_estimado") {
      // Permite solo números y un punto decimal
      const valorNumerico = value.replace(/[^\d.]/g, '');
  
      // Formatea con separador de miles
      const partes = valorNumerico.split('.');
      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
      setFormData({ ...formData, [name]: partes.join('.') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Limpia el monto antes de enviarlo (quita los puntos de miles)
    const montoLimpio = formData.monto_estimado.replace(/\./g, '').replace(',', '.');
  
    const datosFormateados = {
      ...formData,
      monto_estimado: parseFloat(montoLimpio)
    };
  
    try {
      const response = await fetch(`${API_URL}/requerimientos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormateados),
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
      <div className="logo-container">
          <a href="/">
            <img src="logoMK.png" alt="Logo Merkahorro" />
          </a>
        </div>
      <h1 className="gastos-header">Automatización de Gasto</h1>

      {!isSubmitted ? (
        <div className="gastos-form-container">
          <h2 className="gastos-form-title">Formulario de Solicitud de Gasto</h2>
          <form onSubmit={handleSubmit} className="gastos-form">
            
            <div className="gastos-form-field">
              <label className="gastos-label">Nombre Completo:</label>
              <input type="text" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} required className="gastos-input" />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Área:</label>
              <select name="area" value={formData.area} onChange={handleChange} required className="gastos-input">
                <option value="">Seleccione un área</option>
                <option value="Gerencia">Gerencia</option>
                <option value="Gestión humana">Dirección Gestión humana</option>
                <option value="Operaciones">Dirección Operaciones</option>
                <option value="Contabilidad">Dirección Administrativa y Financiera</option>
                <option value="Comercial">Dirección Comercial</option>
              </select>
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Descripción:</label>
              <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} required className="gastos-input" />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Monto Estimado:</label>
              <input type="number" name="monto_estimado" value={formData.monto_estimado} onChange={handleChange} required className="gastos-input" />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Factura (URL o archivo):</label>
              <input type="text" name="archivo_factura" value={formData.archivo_factura} onChange={handleChange} required className="gastos-input" />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Cotización (URL o archivo):</label>
              <input type="text" name="archivo_cotizacion" value={formData.archivo_cotizacion} onChange={handleChange} required className="gastos-input" />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Correo del Empleado:</label>
              <input type="email" name="correo_empleado" value={formData.correo_empleado} onChange={handleChange} required className="gastos-input" />
            </div>

            <button type="submit" className="gastos-submit-button">Enviar</button>
          </form>

          <button onClick={obtenerHistorial} className="gastos-historial-button">📜</button>
        </div>
      ) : (
        <div className="gastos-submitted-message">
          <h2>¡Solicitud Enviada Exitosamente!</h2>
        </div>
      )}

      {mostrarHistorial && (
        <div id="gastos-historial" className="gastos-historial desplegado">
          <h2>Historial de Gastos</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Área</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Factura</th>
                <th>Cotización</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.nombre_completo}</td>
                  <td>{gasto.area}</td>
                  <td>{gasto.descripcion}</td>
                  <td>${gasto.monto_estimado}</td>
                  <td><a href={gasto.archivo_factura}>Ver</a></td>
                  <td><a href={gasto.archivo_cotizacion}>Ver</a></td>
                  <td>{gasto.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { Gastos };
