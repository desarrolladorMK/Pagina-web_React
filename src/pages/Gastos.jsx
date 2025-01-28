import React, { useState, useEffect } from "react";
import "./Gastos.css";

const Gastos = () => {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    area: "",
    procesos: "",
    sede: "",
    unidad: "",
    descripcion: "",
    monto_estimado: "",
    archivo_cotizacion: "",
    correo_empleado: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [decision, setDecision] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nueva protección contra clics múltiples
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false); // Indicador de carga para el historial

  const API_URL = "https://backend-gastos.vercel.app/api";

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
    if (isLoadingHistorial) return; // Evitar múltiples solicitudes mientras se carga el historial
    setIsLoadingHistorial(true);

    try {
      const response = await fetch(`${API_URL}/requerimientos`);
      if (response.ok) {
        const { data } = await response.json();
        setHistorial(data);
        setMostrarHistorial(!mostrarHistorial);

        if (!mostrarHistorial) {
          setTimeout(() => {
            const historialElement =
              document.getElementById("gastos-historial");
            if (historialElement) {
              historialElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 0); // Cambiado a 0 para hacer el scroll inmediato
        }
      } else {
        alert("Error al obtener el historial de gastos.");
      }
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      alert("Hubo un error al cargar el historial.");
    } finally {
      setIsLoadingHistorial(false);
    }
  };

  // Formateador de moneda colombiana
  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "monto_estimado") {
      const valorNumerico = value.replace(/\D/g, "");
      const valorFormateado = valorNumerico
        ? formatoCOP.format(valorNumerico)
        : "";

      setFormData({ ...formData, [name]: valorFormateado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Protección contra múltiples envíos
    setIsSubmitting(true);

    const montoLimpio = formData.monto_estimado.replace(/[$.,\s]/g, "");
    const datosFormateados = {
      ...formData,
      monto_estimado: parseFloat(montoLimpio),
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
    } finally {
      setIsSubmitting(false);
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
          <h2 className="gastos-form-title">
            Formulario de Solicitud de Gasto
          </h2>
          <form onSubmit={handleSubmit} className="gastos-form">
            <div className="gastos-form-field">
              <label className="gastos-label">Nombre Completo:</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Área:</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="">Seleccione un área</option>
                <option value="Gerencia">Gerencia</option>
                <option value="Gestión humana">Dirección Gestión humana</option>
                <option value="Operaciones">Dirección Operaciones</option>
                <option value="Contabilidad">
                  Dirección Administrativa y Financiera
                </option>
                <option value="Comercial">Dirección Comercial</option>
              </select>
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Procesos:</label>
              <select
                name="procesos"
                value={formData.procesos}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="">Seleccione un Proceso</option>
                <option value="Logística">Logística</option>
                <option value="Inventarios">Inventarios</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Almacén">Almacén</option>
                <option value="Procesos">Procesos</option>
                <option value="Fruver">Fruver</option>
                <option value="Cárnicos">Cárnicos</option>
                <option value="Proyectos">Proyectos</option>
              </select>
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label"> Sedes:</label>
              <select
                name="sede"
                value={formData.sede}
                onChange={handleChange}
                required
                className="gastos-input"
              >
                <option value="">Seleccione la Sede</option>
                <option value="Copacabana Plaza">Copacabana Plaza</option>
                <option value="Copacabana Vegas">Copacabana Vegas</option>
                <option value="Copacabana San Juan">Copacabana San Juan</option>
                <option value="Girardota Parque">Girardota Parque</option>
                <option value="Girardota Llano">Girardota Llano</option>
                <option value="Barbosa">Barbosa</option>
                <option value="Carnes Barbosa">Carnes Barbosa</option>
                <option value="Villa Hermosa">Villa Hermosa</option>
              </select>
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">Unidad de Negocio:</label>
              <select
                name="unidad"
                value={formData.unidad} // Debería ser un array
                onChange={handleChange}
                required
                className="gastos-input"
                
              >
                <option value="Carnes">Carnes</option>
                <option value="Fruver">Fruver</option>
                <option value="Abarrotes">Abarrotes</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>

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
                type="text"
                name="monto_estimado"
                value={formData.monto_estimado}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>

            <div className="gastos-form-field">
              <label className="gastos-label">
                Cotización (URL o archivo):
              </label>
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
              <label className="gastos-label">Correo del Empleado:</label>
              <input
                type="email"
                name="correo_empleado"
                value={formData.correo_empleado}
                onChange={handleChange}
                required
                className="gastos-input"
              />
            </div>

            <button
              type="submit"
              className="gastos-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </form>

          <button
            onClick={obtenerHistorial}
            className="gastos-historial-button"
            disabled={isLoadingHistorial}
          >
            {isLoadingHistorial ? "↻" : "📜"}
          </button>
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
                <th>Procesos</th>
                <th>Centro de Operaciones</th>
                <th>Unidad de Negocio</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Cotización</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.nombre_completo}</td>
                  <td>{gasto.area}</td>
                  <td>{gasto.procesos}</td>
                  <td>{gasto.sede}</td>
                  <td>{gasto.unidad}</td>
                  <td>{gasto.descripcion}</td>
                  <td>${gasto.monto_estimado}</td>

                  <td>
                    <a
                      href={gasto.archivo_cotizacion}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver
                    </a>
                  </td>
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
